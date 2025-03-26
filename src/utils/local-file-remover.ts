import fs from 'fs';

export const removeLocalFile = (filePath: string): void => {
  fs.unlinkSync(filePath);
};
