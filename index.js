const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Owner Information
const OWNER_INFO = {
    developer: "Rajan",
    telegram_channel: "@rajanhackerd",
    status: "Active"
};

/**
 * Instagram Collaboration Checker API
 * Developed for: Rajan (@rajanhackerd)
 */

app.get('/', (req, res) => {
    res.json({
        message: "Instagram Collaboration Checker API is running",
        owner: OWNER_INFO.developer,
        channel: OWNER_INFO.telegram_channel,
        usage: "/api/check?username=YOUR_USERNAME"
    });
});

app.get('/api/check', async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({
            error: "Username is required",
            example: "/api/check?username=instagram"
        });
    }

    // Clean username
    const cleanUsername = username.replace('@', '').trim();

    try {
        const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${cleanUsername}`;
        const headers = {
            "X-IG-App-ID": "936619743392459",
            "Referer": `https://www.instagram.com/${cleanUsername}/`,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        };

        const response = await axios.get(url, { headers, timeout: 15000 });
        
        if (!response.data || !response.data.data || !response.data.data.user) {
            return res.status(404).json({ error: "User not found or API structure changed" });
        }

        const user = response.data.data.user;
        const posts = user.edge_owner_to_timeline_media?.edges || [];
        
        let collaborationCount = 0;
        let uniqueCollaborators = new Set();
        let analyzedPosts = [];

        // Analyze last 10 posts
        posts.slice(0, 10).forEach((post, index) => {
            const node = post.node;
            const collabs = node.edge_media_to_tagged_user?.edges || [];
            const postInfo = {
                id: index + 1,
                shortcode: node.shortcode,
                url: `https://instagram.com/p/${node.shortcode}`,
                has_collaborators: collabs.length > 0,
                collaborators: []
            };

            if (collabs.length > 0) {
                collaborationCount++;
                collabs.forEach(c => {
                    const collabUser = c.node.user.username;
                    postInfo.collaborators.push(`@${collabUser}`);
                    uniqueCollaborators.add(collabUser);
                });
            }
            analyzedPosts.push(postInfo);
        });

        const result = {
            status: "success",
            owner_info: OWNER_INFO,
            profile: {
                username: user.username,
                full_name: user.full_name,
                is_private: user.is_private,
                profile_pic: user.profile_pic_url_hd,
                followers: user.edge_followed_by?.count || 0,
                following: user.edge_follow?.count || 0,
                total_posts: user.edge_owner_to_timeline_media?.count || 0
            },
            analysis: {
                posts_analyzed: analyzedPosts.length,
                collaboration_posts: collaborationCount,
                unique_collaborators_count: uniqueCollaborators.size,
                unique_collaborators: Array.from(uniqueCollaborators).map(u => `@${u}`),
                recent_posts: analyzedPosts
            },
            engagement: posts.length > 0 ? {
                latest_post_likes: posts[0].node.edge_media_preview_like?.count || 0,
                latest_post_comments: posts[0].node.edge_media_to_comment?.count || 0
            } : null
        };

        res.json(result);

    } catch (error) {
        console.error("API Error:", error.message);
        if (error.response) {
            if (error.response.status === 404) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(error.response.status).json({ 
                error: `Instagram API returned ${error.response.status}`,
                details: error.response.data
            });
        }
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Owner: ${OWNER_INFO.developer} | Channel: ${OWNER_INFO.telegram_channel}`);
});
