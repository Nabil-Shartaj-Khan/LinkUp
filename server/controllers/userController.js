const db = require("../config/database");


// UPDATE PROFILE
const updateProfile = async (req, res) => {
    try {
        const { displayName, bio } = req.body;

        // Check required display name
        if (!displayName) {
            return res.status(400).json({
                success: false,
                message: "Display name is required",
            });
        }

        // Update the logged-in user's profile
        await db.query(
            `UPDATE users
            SET display_name = ?, bio = ?
            WHERE id = ?`,
            [
                displayName,
                bio || null,
                req.userId
            ]
        );

        // Get the updated user
        const [users] = await db.query(
            `SELECT
                id,
                username,
                email,
                display_name,
                profile_picture,
                bio,
                is_online,
                last_seen,
                created_at,
                updated_at
            FROM users
            WHERE id = ?`,
            [req.userId]
        );

        const user = users[0];

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                displayName: user.display_name,
                profilePicture: user.profile_picture,
                bio: user.bio,
                isOnline: user.is_online,
                lastSeen: user.last_seen,
                createdAt: user.created_at,
                updatedAt: user.updated_at,
            },
        });

    } catch (error) {
        console.error("Update profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

// SEARCH USERS
const searchUsers = async (req, res) => {
    try {
        const { search } = req.query;

        if (!search || !search.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search term is required",
            });
        }

        const searchTerm = `%${search.trim()}%`;

        const [users] = await db.query(
            `SELECT
                id,
                username,
                display_name,
                profile_picture,
                bio,
                is_online,
                last_seen
            FROM users
            WHERE id != ?
            AND (
                username LIKE ?
                OR display_name LIKE ?
            )
            LIMIT 20`,
            [
                req.userId,
                searchTerm,
                searchTerm
            ]
        );

        const formattedUsers = users.map((user) => ({
            id: user.id,
            username: user.username,
            displayName: user.display_name,
            profilePicture: user.profile_picture,
            bio: user.bio,
            isOnline: user.is_online,
            lastSeen: user.last_seen,
        }));

        return res.status(200).json({
            success: true,
            users: formattedUsers,
        });

    } catch (error) {
        console.error("Search users error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};
module.exports = {
    updateProfile,
    searchUsers,
};