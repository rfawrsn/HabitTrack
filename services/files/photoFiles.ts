import * as FileSystem from 'expo-file-system/legacy';

const PHOTO_DIRECTORY_NAME = 'habittrack-photos';

// Camera captures live in a temporary cache folder, so each photo is copied to app storage to keep it.
export async function persistPhotoFile(temporaryUri: string): Promise<string> {
  const directory = `${FileSystem.documentDirectory}${PHOTO_DIRECTORY_NAME}/`;
  await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  const target = `${directory}${Date.now()}.jpg`;
  await FileSystem.copyAsync({ from: temporaryUri, to: target });
  return target;
}

export async function removePhotoFile(uri: string): Promise<void> {
  await FileSystem.deleteAsync(uri, { idempotent: true });
}
