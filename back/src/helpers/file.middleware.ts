import multer from "multer";
import { extname } from "path";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/${file.fieldname}`);
  },
  filename: function (req, file, cb) {
    // console.log(file);
    cb(null, `${uuidv4()}${extname(file.originalname)}`);
  },
});

export default multer({ storage }).fields([
  { name: "images", maxCount: 10 },
  { name: "files", maxCount: 10 },
]);
