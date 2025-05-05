import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  TaskList: undefined;
  AddTask: undefined;
};

type AddTaskScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddTask'>;

const AddTask: React.FC = () => {
  const navigation = useNavigation<AddTaskScreenNavigationProp>();
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (!deadline.trim()) {
      Alert.alert('Error', 'Please enter a deadline');
      return;
    }

    try {
      const newTask = {
        id: Date.now().toString(),
        title: title.trim(),
        deadline: deadline.trim(),
        priority,
        completed: false,
      };

      const existingTasks = await AsyncStorage.getItem('tasks');
      const tasks = existingTasks ? JSON.parse(existingTasks) : [];
      const updatedTasks = [...tasks, newTask];

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save task');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Task Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Deadline</Text>
        <TextInput
          style={styles.input}
          value={deadline}
          onChangeText={setDeadline}
          placeholder="Enter deadline (e.g., 2024-03-20)"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityContainer}>
          {(['low', 'medium', 'high'] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.priorityButton,
                priority === p && styles.priorityButtonActive,
                { backgroundColor: getPriorityColor(p) },
              ]}
              onPress={() => setPriority(p)}
            >
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === p && styles.priorityButtonTextActive,
                ]}
              >
                {p.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Task</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'high':
      return '#ff4444';
    case 'medium':
      return '#ffbb33';
    case 'low':
      return '#00C851';
    default:
      return '#666666';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    opacity: 0.7,
  },
  priorityButtonActive: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  priorityButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  priorityButtonTextActive: {
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddTask; 