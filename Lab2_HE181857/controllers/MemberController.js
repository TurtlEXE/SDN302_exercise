const Member = require('../models/Member');

// Get all members
const getAllMembers = async (req, res) => {
    try {
        const members = await Member.find();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single member by ID
const getMemberById = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new member
const createMember = async (req, res) => {
    try {
        const { fullName, email, phone, membershipType, isActive } = req.body;
        const newMember = new Member({ fullName, email, phone, membershipType, isActive });
        await newMember.save();
        res.status(201).json(newMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing member
const updateMember = async (req, res) => {
    try {
        const { fullName, email, phone, membershipType, isActive } = req.body;
        const updatedMember = await Member.findByIdAndUpdate(
            req.params.id,
            { fullName, email, phone, membershipType, isActive },
            { new: true, runValidators: true }
        );
        if (!updatedMember) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json(updatedMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a member
const deleteMember = async (req, res) => {
    try {
        const deletedMember = await Member.findByIdAndDelete(req.params.id);
        if (!deletedMember) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember
};