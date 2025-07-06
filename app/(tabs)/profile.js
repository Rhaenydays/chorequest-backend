import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BASE_URL } from '@/constants/Api';

export default function Profile() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/users`)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        if (data.length > 0) setSelectedUserId(data[0].id);
      })
      .catch(err => {
        setError("Could not load user list");
        console.error("User fetch error:", err);
      });
  }, []);

  useEffect(() => {
    if (selectedUserId != null) {
      fetch(`${BASE_URL}/users/${selectedUserId}`)
        .then(res => res.json())
        .then(setUser)
        .catch(err => {
          setError("Could not load selected user");
          console.error("Selected user error:", err);
        });
    }
  }, [selectedUserId]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose Profile:</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {users.length > 0 ? (
        <Picker
          selectedValue={selectedUserId}
          onValueChange={(value) => setSelectedUserId(value)}
          style={styles.picker}
        >
          {users.map((u, index) => (
            <Picker.Item
              key={`user-${u.id ?? index}`}
              label={u.name ?? `User ${index + 1}`}
              value={u.id}
            />
          ))}
        </Picker>
      ) : (
        !error && <Text style={styles.loading}>Loading users...</Text>
      )}

      {user && (
        <View style={styles.card}>
          <Text style={styles.name}>{user.name || 'Unnamed User'}</Text>
          <Image
            source={{ uri: user.avatar_url || 'https://placekitten.com/200/200' }}
            style={styles.avatar}
          />
          <Text>Stars Earned: {user.stars_earned ?? 'N/A'}</Text>
          <Text>Weekly Goal: {user.weekly_goal ?? 'N/A'}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  loading: { fontStyle: 'italic', color: '#666', marginBottom: 20 },
  error: { color: 'red', marginBottom: 10 },
  picker: { marginBottom: 20 },
  card: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  name: { fontSize: 22, fontWeight: 'bold' },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 10,
  },
});
