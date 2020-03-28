const express = require('express');
const config = require('config');
const request = require('request');
const { check, validationResult } = require('express-validator');
const authorize = require('../../middleware/authorize');

const User = require('../../models/User');
const Profile = require('../../models/Profile');


const router = express.Router();

// @route   POST api/profile/me
// @desc    Get current user profile
// @access  Private

router.get('/me', authorize, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      res.status(400).send({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile
// @desc    Create OR update a profile
// @access  Private

router.post(
  '/',
  [
    authorize,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      facebook,
      instagram,
      linkedin
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skil => skil.trim());
    }
    console.log(profileFields);
    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update existing profile
        profile = await profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      // Create new profile
      profile = new Profile(profileFields);
      await profile.save();

      return res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error!.');
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by ID
// @access  Public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) res.status(400).send({ msg: 'Profile Not Found' });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).send({ msg: 'Profile Not Found' });
    }

    res.status(500).send('Server Error!.');
  }
});

// @route   DELETE api/profile
// @desc    DELETE user, profile
// @access  Private

router.delete('/', authorize, async (req, res) => {
  try {
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove User
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User Deleted.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error!.');
  }
});

// @route   PUT api/profile/experience
// @desc    Add experience to profile
// @access  Private

router.put(
  '/experience',
  [
    authorize,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'Company field is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = { title, company, location, from, to, current, description };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    DELETE experience from profile
// @access  Private

router.delete('/experience/:exp_id', authorize, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error!.');
  }
});

///

// @route   PUT api/profile/education
// @desc    Add education to profile
// @access  Private

router.put(
  '/education',
  [
    authorize,
    [
      check('school', 'School is required')
        .not()
        .isEmpty(),
      check('degree', 'Degree field is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Fieldofstudy is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEducation);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/profile/education/:exp_id
// @desc    DELETE education from profile
// @access  Private

router.delete('/education/:edu_id', authorize, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error!.');
  }
});

// // @route    GET api/profile/github/:username
// // @desc     Get user repos from Github
// // @access   Public
// router.get('/github/:username', async (req, res) => {
//   try {
//     const options = {
//       uri: encodeURI(
//         `https://api.github.com/users/${
//           req.params.username
//         }/repos?per_page=5&sort=created:asc&client_id=${config.get(
//           'githubClientId'
//         )}&client_secret=${config.get('githubClientSecret')}`
//       ),
//       method: 'GET',
//       headers: { 'user-agent': 'node.js' }
//     };

//     request(options, (error, response, body) => {
//       if (error) console.error(error);
      
//       if (!error && response.statusCode !== 200) {
//         return res.status(404).json({ msg: 'No Github profile found' });
//       }

//       res.json(JSON.parse(body));
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

module.exports = router;
