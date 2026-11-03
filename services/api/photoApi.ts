import { apiRequest } from '@/services/http/apiClient';
import type { CreatePhotoDto, PhotoDto } from '@/types/api';

export function fetchPhotos(): Promise<PhotoDto[]> {
  return apiRequest<PhotoDto[]>({ method: 'GET', url: '/photos' });
}

export function createPhoto(data: CreatePhotoDto): Promise<PhotoDto> {
  return apiRequest<PhotoDto>({ method: 'POST', url: '/photos', data });
}

export function deletePhoto(photoId: string): Promise<void> {
  return apiRequest<void>({ method: 'DELETE', url: `/photos/${photoId}` });
}
