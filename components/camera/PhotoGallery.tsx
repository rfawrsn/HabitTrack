import { useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Images, X } from 'lucide-react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { usePhotos } from '@/hooks/usePhotos';
import { deletePhoto } from '@/services/api/photoApi';
import { removePhotoFile } from '@/services/files/photoFiles';
import { toApiError } from '@/services/http/apiError';
import type { PhotoDto } from '@/types/api';
import { formatPhotoDate } from '@/utils/date';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { StatusMessage } from '@/components/ui/StatusMessage';

export function PhotoGallery() {
  const { photos, status, errorMessage, reload } = usePhotos();
  const [selected, setSelected] = useState<PhotoDto | null>(null);

  if (status === 'loading') {
    return <ActivityIndicator color={colors.primary} style={styles.loader} />;
  }

  if (status === 'error') {
    return <ErrorState message={errorMessage ?? 'Gagal memuat galeri.'} onRetry={reload} />;
  }

  if (photos.length === 0) {
    return (
      <EmptyState
        icon={Images}
        title="Belum ada foto"
        description="Ambil foto kebiasaanmu untuk mendokumentasikan progres dan pencapaian."
      />
    );
  }

  return (
    <>
      <FlatList
        data={photos}
        numColumns={2}
        keyExtractor={(photo) => photo.id}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Buka foto ${item.caption || item.habitName || 'dokumentasi'}`}
            onPress={() => setSelected(item)}
            style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
            <Image source={{ uri: item.uri }} style={styles.thumbnail} resizeMode="cover" />
            <Text style={styles.tileCaption} numberOfLines={1}>
              {item.caption || item.habitName || 'Dokumentasi'}
            </Text>
          </Pressable>
        )}
      />
      <PhotoViewer
        photo={selected}
        onClose={() => setSelected(null)}
        onDeleted={() => {
          setSelected(null);
          reload();
        }}
      />
    </>
  );
}

interface PhotoViewerProps {
  photo: PhotoDto | null;
  onClose: () => void;
  onDeleted: () => void;
}

function PhotoViewer({ photo, onClose, onDeleted }: PhotoViewerProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleClose() {
    setIsConfirming(false);
    setDeleteError(null);
    onClose();
  }

  async function handleDelete() {
    if (!photo) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deletePhoto(photo.id);
      await removePhotoFile(photo.uri);
      setIsConfirming(false);
      onDeleted();
    } catch (error) {
      setDeleteError(toApiError(error).message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal visible={photo !== null} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.viewerOverlay}>
        <View style={styles.viewerCard}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tutup"
            onPress={handleClose}
            style={styles.closeButton}>
            <X size={20} color={colors.text} />
          </Pressable>
          {photo ? (
            <ScrollView contentContainerStyle={styles.viewerContent} showsVerticalScrollIndicator={false}>
              <Image source={{ uri: photo.uri }} style={styles.viewerImage} resizeMode="contain" />
              <Text style={styles.viewerTitle}>{photo.caption || 'Tanpa keterangan'}</Text>
              {photo.habitName ? <Text style={styles.viewerHabit}>Kebiasaan: {photo.habitName}</Text> : null}
              <Text style={styles.viewerDate}>{formatPhotoDate(photo.createdAt)}</Text>

              {deleteError ? <StatusMessage tone="error" message={deleteError} /> : null}

              {isConfirming ? (
                <View style={styles.confirmBox}>
                  <Text style={styles.confirmText}>Hapus foto ini dari galeri?</Text>
                  <View style={styles.viewerActions}>
                    <Button title="Batal" variant="secondary" onPress={() => setIsConfirming(false)} disabled={isDeleting} style={styles.action} />
                    <Button title="Hapus" variant="danger" onPress={handleDelete} loading={isDeleting} style={styles.action} />
                  </View>
                </View>
              ) : (
                <Button title="Hapus foto" variant="danger" onPress={() => setIsConfirming(true)} />
              )}
            </ScrollView>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginTop: spacing.lg,
  },
  grid: {
    padding: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  column: {
    gap: spacing.sm,
  },
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  tileCaption: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  viewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 31, 23, 0.6)',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  viewerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.sm,
    maxHeight: '90%',
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  viewerContent: {
    gap: spacing.xs,
  },
  viewerImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  viewerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
  },
  viewerHabit: {
    fontSize: 15,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  viewerDate: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  confirmBox: {
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.errorLight,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.error,
  },
  viewerActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  action: {
    flex: 1,
  },
});
