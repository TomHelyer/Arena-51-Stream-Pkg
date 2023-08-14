import express from 'express';
import fs from 'fs';

const router = express.Router();

router.route('/image/:bucket/:image')
  .get((req,res) => {
    fs.promises.readFile(`${__dirname}/repo/${req.params.bucket}/${req.params.image}.png`, {encoding: 'base64'})
    .then(val => {
      res.status(200).json({image: val});
    }).catch(err => res.status(401).send(err));
  })
  .post((req,res) => {
    if(req.body && req.body.img){
      const img = req.body.img as string;
      const buf = Buffer.from(img.split(",")[1], "base64");
      fs.promises.writeFile(`${__dirname}/repo/${req.params.bucket}/${req.params.image}.png`, buf)
      .then(val => {
        res.status(201).send("Successfully added image repo");
      }).catch(err => res.status(401).send(err));
    }
    else
      res.status(400).send("Invalid image body");
  });

  
router.get('/imagelist/:bucket', (req,res) => {
  let list: string[] = [];

  fs.promises.readdir(`${__dirname}/repo/${req.params.bucket}`).then((files) => {
    list = list.concat(files.map(f => f.split('.')[0]));
  });

  res.json(list);
});

export default router;