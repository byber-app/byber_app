import { diskStorage } from 'multer';

export const MulterOptions = {
    storage: diskStorage({
        destination: 'src/upload',
        filename: (req, file, callback) => {
            const filename = `${Date.now()} - ${file.originalname}`; // Fayla dinamik ad təyini
            callback(null, filename);
        },
    }),
    fileFilter: (req: any, file: any, callback: any) => {
        // Yalnız şəkil fayllarına icazə verir
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            return callback(new Error('Yalnız şəkil fayllarına icazə verilir!'), false);
        }
        callback(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // Maksimum fayl ölçüsü: 10MB
    },
};