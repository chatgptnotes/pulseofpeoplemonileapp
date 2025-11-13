import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface Note {
  id: string;
  text: string;
  timestamp: string;
  type: 'note' | 'incident' | 'issue';
}

export const QuickNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState<Note['type']>('note');

  const addNote = async () => {
    if (noteText.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        text: noteText.trim(),
        timestamp: new Date().toISOString(),
        type: noteType,
      };
      setNotes([newNote, ...notes]);
      setNoteText('');
      setModalVisible(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const getTypeIcon = (type: Note['type']) => {
    switch (type) {
      case 'incident':
        return { name: 'warning' as const, color: '#EF4444' };
      case 'issue':
        return { name: 'error' as const, color: '#F59E0B' };
      default:
        return { name: 'note' as const, color: '#6366F1' };
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="sticky-note-2" size={20} color="#6366F1" />
          <Text style={styles.title}>Quick Notes</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{notes.length}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {notes.length > 0 ? (
        <ScrollView style={styles.notesList} showsVerticalScrollIndicator={false}>
          {notes.slice(0, 3).map((note) => {
            const icon = getTypeIcon(note.type);
            return (
              <View key={note.id} style={styles.noteItem}>
                <MaterialIcons name={icon.name} size={16} color={icon.color} />
                <View style={styles.noteContent}>
                  <Text style={styles.noteText} numberOfLines={2}>
                    {note.text}
                  </Text>
                  <Text style={styles.noteTime}>{formatTime(note.timestamp)}</Text>
                </View>
              </View>
            );
          })}
          {notes.length > 3 && (
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View all {notes.length} notes</Text>
              <MaterialIcons name="arrow-forward" size={14} color="#6366F1" />
            </TouchableOpacity>
          )}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons name="note-add" size={32} color="#D1D5DB" />
          <Text style={styles.emptyText}>No notes yet</Text>
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Note</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.typeSelector}>
              {(['note', 'incident', 'issue'] as const).map((type) => {
                const icon = getTypeIcon(type);
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      noteType === type && { backgroundColor: `${icon.color}15` },
                    ]}
                    onPress={() => setNoteType(type)}
                  >
                    <MaterialIcons
                      name={icon.name}
                      size={20}
                      color={noteType === type ? icon.color : '#9CA3AF'}
                    />
                    <Text
                      style={[
                        styles.typeLabel,
                        noteType === type && { color: icon.color },
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Enter your note..."
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              autoFocus
            />

            <TouchableOpacity
              style={[styles.saveButton, !noteText.trim() && styles.saveButtonDisabled]}
              onPress={addNote}
              disabled={!noteText.trim()}
            >
              <Text style={styles.saveButtonText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  countBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6366F1',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesList: {
    maxHeight: 200,
  },
  noteItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  noteContent: {
    flex: 1,
  },
  noteText: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
    lineHeight: 18,
  },
  noteTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    gap: 6,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#111827',
    minHeight: 100,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
