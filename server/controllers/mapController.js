import axios from 'axios';
import SearchHistory from '../models/SearchHistory.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

// Search Location
export const searchLocation = async (req, res) => {
  const { searchTerm }  = req.body;
  try {
    console.log(process.env.MAPS_API)
    const response = await axios.get(process.env.MAPS_API || "https://nominatim.openstreetmap.org/search", {
      params: {
        q: searchTerm,
        format: 'json',
      },
    });
    if (response.data.length === 0) {
      return res.status(404).json({ msg: 'No locations found' });
    }

    const location = response.data[0];

    const searchHistory = await SearchHistory.create({
      user: req.user, 
      term: searchTerm,
      location,
    });
  
    const user = await User.findById(req.user);
    if (user) {
      user.searchHistory.push(searchHistory);
      await user.save();
    } else {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ location });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get Search History
export const searchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate('searchHistory');
    res.json(user.searchHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
}

// Delete Search History Item
export const deletedSearchHistory = async (req, res) => {
  try {
    await SearchHistory.findByIdAndDelete(req.params.id);
    const user = await User.findById(req.user);
    user.searchHistory = user.searchHistory.filter(item => item.toString() !== req.params.id);
    await user.save();
    res.json(user.searchHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
}

