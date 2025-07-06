import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Switch } from 'react-native';
import { BASE_URL } from '@/constants/Api';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/tasks`)
      .then(async (res) => {
        const text = await res.text();

        if (!res.ok) {
          throw new Error(`Server error: ${text}`);
        }

        try {
          return JSON.parse(text);
        } catch {
          throw new Error(`Invalid JSON: ${text}`);
        }
      })
      .then(data => setTasks(data))
      .catch(err => console.error("Error fetching tasks:", err.message));
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.room}>{item.room || 'Unassigned Room'}</Text>
      <Text style={styles.task}>{item.task || 'Unnamed Task'}</Text>
      <Text>Assigned to: {item.assigned_to || 'Unassigned'}</Text>
      <Switch
        value={!!item.completed}
        disabled
        trackColor={{ false: '#ccc', true: '#4caf50' }}
        thumbColor={item.completed ? '#2e7d32' : '#999'}
      />
    </View>
  );

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item, index) =>
        item.id != null ? item.id.toString() : `task-${index}`
      }
      renderItem={renderItem}
      ListEmptyComponent={<Text style={styles.empty}>No tasks available</Text>}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    margin: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  room: { fontWeight: 'bold' },
  task: { fontSize: 16, marginBottom: 5 },
  empty: { textAlign: 'center', marginTop: 20 },
});
