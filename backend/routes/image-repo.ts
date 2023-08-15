import express from 'express';
import fs from 'fs';

const router = express.Router();

router.route('/image/:bucket/:image')
  .get((req,res) => {
    fs.promises.readFile(`${process.cwd()}/repo/${req.params.bucket}/${req.params.image}.png`, {encoding: 'base64'})
    .then(val => {
      res.status(200).json({image: val});
    }).catch(err => res.status(401).send(err));
  })
  .post((req,res) => {
    if(req.body && req.body.img){
      const img = req.body.img as string;
      const buf = Buffer.from(img.split(",")[1], "base64");
      fs.promises.writeFile(`${process.cwd()}/repo/${req.params.bucket}/${req.params.image}.png`, buf)
      .then(val => {
        res.status(201).send("Successfully added image repo");
      }).catch(err => res.status(401).send(err));
    }
    else
      res.status(400).send("Invalid image body");
  });

  
router.get('/imagelist/:bucket', (req,res) => {
  let list: string[] = [];

  fs.promises.readdir(`${process.cwd()}/repo/${req.params.bucket}`).then((files) => {
    res.json(files.map((val: string) => val.split('.')[0]));
  }).catch(err => console.log(err));
});

export default router;