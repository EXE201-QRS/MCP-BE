// import { UPLOAD_DIR } from '@/common/constants/other.constant'

import { UPLOAD_DIR } from '@/common/constants/other.constant'
import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { existsSync, mkdirSync } from 'fs'
import multer from 'multer'
import { generateRandomFileName } from '../../shared/helpers'
import { MediaController } from './media.controller'
import { MediaService } from './media.service'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    const newFilename = generateRandomFileName(file.originalname)
    cb(null, newFilename)
  }
})

@Module({
  imports: [
    MulterModule.register({
      storage
    })
  ],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule {
  constructor() {
    if (!existsSync(UPLOAD_DIR)) {
      // Create the upload directory if it does not exist
      mkdirSync(UPLOAD_DIR, { recursive: true })
    }
  }
}
