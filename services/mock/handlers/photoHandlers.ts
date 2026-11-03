import type { CreatePhotoDto, PhotoDto } from '@/types/api';
import {
  createId,
  readCollection,
  StoredPhoto,
  writeCollection,
} from '@/services/mock/mockDatabase';
import {
  asRecord,
  MockHttpError,
  MockRequest,
  MockResult,
  readOptionalText,
  readText,
  requireUserId,
} from '@/services/mock/mockRequest';
import { validateCaption } from '@/utils/validation';

async function toPhotoDto(photo: StoredPhoto): Promise<PhotoDto> {
  const habit = photo.habitId
    ? (await readCollection('habits')).find((item) => item.id === photo.habitId)
    : undefined;
  return {
    id: photo.id,
    uri: photo.uri,
    caption: photo.caption,
    habitId: photo.habitId,
    habitName: habit?.name ?? null,
    createdAt: photo.createdAt,
  };
}

export async function listPhotos(request: MockRequest): Promise<MockResult> {
  const userId = requireUserId(request);
  const photos = (await readCollection('photos'))
    .filter((photo) => photo.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { status: 200, data: await Promise.all(photos.map(toPhotoDto)) };
}

export async function createPhoto(request: MockRequest): Promise<MockResult> {
  const userId = requireUserId(request);
  const record = asRecord(request.body);
  const uri = readText(record, 'uri').trim();
  const caption = (readOptionalText(record, 'caption') ?? '').trim();
  const habitId = readOptionalText(record, 'habitId') ?? null;

  if (uri.length === 0) throw new MockHttpError(400, 'Foto tidak valid.');
  const validationError = validateCaption(caption);
  if (validationError) throw new MockHttpError(400, validationError);
  if (habitId !== null) {
    const habitExists = (await readCollection('habits')).some(
      (habit) => habit.id === habitId && habit.userId === userId,
    );
    if (!habitExists) throw new MockHttpError(400, 'Kebiasaan yang dipilih tidak ditemukan.');
  }

  const input: CreatePhotoDto = { uri, caption, habitId };
  const photo: StoredPhoto = {
    id: createId(),
    userId,
    uri: input.uri,
    caption: input.caption,
    habitId: input.habitId,
    createdAt: new Date().toISOString(),
  };
  await writeCollection('photos', [...(await readCollection('photos')), photo]);
  return { status: 201, data: await toPhotoDto(photo) };
}

export async function deletePhoto(request: MockRequest): Promise<MockResult> {
  const userId = requireUserId(request);
  const photos = await readCollection('photos');
  const target = photos.find((photo) => photo.id === request.params.id && photo.userId === userId);
  if (!target) throw new MockHttpError(404, 'Foto tidak ditemukan.');
  await writeCollection(
    'photos',
    photos.filter((photo) => photo.id !== target.id),
  );
  return { status: 204 };
}
