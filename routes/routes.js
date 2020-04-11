const express = require('express');
const router = express.Router();
const Exercise = require('../database/model/Exercise');

router.get('/fetchExercise/:id', async (req, res) => {
    console.log('[+] /fetchExercise/' + req.params.id + ' called.');
    try {
        const useless = await Exercise.find({_id: req.params.id})
        .then(function(ex) {
            res.json(ex);
            console.log(ex);
            
        });
    } catch (err) {
        res.json({ message: err });
        console.log('fail' + err);
    }
});

module.exports = router;
