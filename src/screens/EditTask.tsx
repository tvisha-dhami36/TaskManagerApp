import React, { useState, useEffect } from 'react';
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type EditTaskScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditTask'>;
type EditTaskScreenRouteProp = RouteProp<RootStackParamList, 'EditTask'>;

interface Task {
  id: string;
  title: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

const EditTask: React.FC = () => {
  const navigation = useNavigation<EditTaskScreenNavigationProp>();
  const route = useRoute<EditTaskScreenRouteProp>();
  const { taskId } = route.params;

  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    loadTask();
  }, []);

  const loadTask = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        const task = tasks.find((t: Task) => t.id === taskId);
        if (task) {
          setTitle(task.title);
          setDeadline(task.deadline);
          setPriority(task.priority);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load task');
      navigation.goBack();
    }
  };

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
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        const updatedTasks = tasks.map((task: Task) =>
          task.id === taskId
            ? {
                ...task,
                title: title.trim(),
                deadline: deadline.trim(),
                priority,
              }
            : task
        );
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
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
          <Text style={styles.saveButtonText}>Update Task</Text>
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

export default EditTask; 