import multer from 'multer';
import path from 'path';
import fs from 'fs';
// Modify the UploadFile function to return the multer middleware
const UploadFile = (foldername = null) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // Define the folder to store uploaded files
            const uploadPath = foldername ? `uploads/${foldername}` : 'uploads';
            // Ensure the folder exists
            fs.existsSync(uploadPath) || fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            // Generate a unique file name using timestamp and file extension
            const uniqueSuffix = Date.now() + path.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix);
        }
    });

    const upload = multer({ storage: storage });

    return upload.single('image'); // Return the multer middleware
}


const multipleImage = (foldername) => {

    try {

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const uploadPath = foldername ? `uploads/${foldername}` : 'uploads';
                // Ensure the folder exists
                fs.existsSync(uploadPath) || fs.mkdirSync(uploadPath, { recursive: true });
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + path.extname(file.originalname);
                cb(null, file.fieldname + '-' + uniqueSuffix);
            }
        })

        const upload = multer({ storage: storage });

        return upload.any(); // Allow unlimited files with any field name
    } catch (error) {
        console.log(error)
    }

}

export { UploadFile, multipleImage };
