const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const verify = require("../verifyToken");

// UPDATE
router.put("/:id", verify, async (req, res) => {
    try {
        const isAuthorized = req.user?.id === req.params.id || req.user.isAdmin;

        if (!isAuthorized) {
            return res.status(403).json("You can only update your account");
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).json(updateUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE
router.delete("/:id", verify, async (req, res) => {
    try {
        const isAuthorized = req.user?.id === req.params.id || req.user.isAdmin;

        if (!isAuthorized) {
            return res.status(403).json("You can only delete your account");
        }

        const userToDelete = await User.findById(req.params.id);

        if (!userToDelete) {
            return res.status(404).json("User not found");
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted....!");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET ONE USER
router.get("/find/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json("User not found");
        }

        const { password, ...info } = user._doc;
        res.status(200).json({ info });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET ALL USERS
router.get("/", verify, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json("You are not allowed to get all users");
        }

        const query = req.query.new;
        const users = query
            ? await User.find().sort({ _id: -1 }).limit(5)
            : await User.find();

        res.status(200).json({ data: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET USER STATS (NO. OF USER PER MONTH)
router.get("/stats", async (req, res) => {
    const today = new Date();
    const lastYear = today.setFullYear(today.getFullYear() - 1);

    try {
        const data = await User.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
