import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Switch } from 'react-native';
import { BASE_URL } from '@/constants/Api';

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [userStars, setUserStars] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/rewards`).then(res => res.json()),
      fetch(`${BASE_URL}/users/0`).then(res => res.json())
    ])
      .then(([rewardsData, userData]) => {
        setRewards(rewardsData);
        setUserStars(userData.stars_earned);
      })
      .catch(err => console.error("Initialization error:", err.message));
  }, []);

  const handleRedeem = (rewardId) => {
    fetch(`${BASE_URL}/rewards/${rewardId}`, { method: "PATCH" })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => {
            throw new Error(`Server error: ${text}`);
          });
        }
        return res.json();
      })
      .then(() => {
        return Promise.all([
          fetch(`${BASE_URL}/rewards`).then(res => res.json()),
          fetch(`${BASE_URL}/users/0`).then(res => res.json())
        ]);
      })
      .then(([updatedRewards, updatedUser]) => {
        setRewards(updatedRewards);
        setUserStars(updatedUser.stars_earned);
      })
      .catch(err => console.error("Redemption error:", err.message));
  };

  const renderItem = ({ item }) => {
    const canRedeem = !item.redeemed && userStars >= item.points_required;

    return (
      <View style={styles.card}>
        <Text style={styles.reward}>{item.reward || 'Unnamed Reward'}</Text>
        <Text>Cost: {item.points_required} stars</Text>
        <Text>Status: {item.redeemed ? 'Redeemed' : 'Available'}</Text>

        {/* Optional display-only toggle to show reward state visually */}
        <Switch
          value={item.redeemed}
          disabled
          trackColor={{ false: '#ccc', true: '#4caf50' }}
          thumbColor={item.redeemed ? '#2e7d32' : '#999'}
        />

        {canRedeem && (
          <Button title="Redeem" onPress={() => handleRedeem(item.id)} />
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={rewards}
      keyExtractor={(item) => item.id?.toString() ?? `reward-${Math.random()}`}
      renderItem={renderItem}
      ListEmptyComponent={<Text style={styles.empty}>No rewards found</Text>}
    />
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, margin: 10, backgroundColor: '#e0f7fa', borderRadius: 8 },
  reward: { fontWeight: 'bold', fontSize: 18 },
  empty: { textAlign: 'center', marginTop: 20 },
});
