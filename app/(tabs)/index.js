import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Animated
} from "react-native";

export default function Index() {
  const sampleTasks = [
    { id: 1, title: "Sweep the kitchen", room: { name: "Kitchen" }, points: 2 },
    { id: 2, title: "Take out trash", room: { name: "Kitchen" }, points: 1 },
    { id: 3, title: "Vacuum living room", room: { name: "Living Room" }, points: 3 },
    { id: 4, title: "Make the bed", room: { name: "Bedroom" }, points: 1 },
    { id: 5, title: "Organize closet", room: { name: "Bedroom" }, points: 2 }
  ];

  const sampleScoreboard = [
    { name: "Alex", score: 10 },
    { name: "Jordan", score: 8 },
    { name: "Taylor", score: 6 }
  ];

  const sampleGoal = {
    title: "Earn 20 points by Friday",
    pointsEarned: 14,
    target: 20
  };

  const sampleChallenge = {
    description: "Wipe down all surfaces in one room ✨"
  };

  const [tasks, setTasks] = useState([]);
  const [scoreboard, setScoreboard] = useState([]);
  const [goal, setGoal] = useState(null);
  const [challenge, setChallenge] = useState(null);

  const fadeAnimations = useRef([]);
  const scaleAnimations = useRef([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setTasks(sampleTasks);
    setScoreboard(sampleScoreboard);
    setGoal(sampleGoal);
    setChallenge(sampleChallenge);
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    const room = task.room?.name || "Unassigned";
    if (!acc[room]) acc[room] = [];
    acc[room].push(task);
    return acc;
  }, {});

  const roomKeys = Object.keys(groupedTasks);

  // Initialize animations once
  if (fadeAnimations.current.length !== roomKeys.length) {
    fadeAnimations.current = roomKeys.map(() => new Animated.Value(0));
    scaleAnimations.current = roomKeys.map(() => new Animated.Value(0.95));
  }

  useEffect(() => {
    roomKeys.forEach((_, index) => {
      Animated.parallel([
        Animated.timing(fadeAnimations.current[index], {
          toValue: 1,
          duration: 400,
          delay: index * 150,
          useNativeDriver: true
        }),
        Animated.spring(scaleAnimations.current[index], {
          toValue: 1,
          friction: 6,
          delay: index * 150,
          useNativeDriver: true
        })
      ]).start();
    });
  }, [roomKeys]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>ChoreQuest</Text>
        <Text style={styles.subtitle}>Welcome back, adventurer 🧙</Text>
      </View>

      <Text style={styles.sectionHeader}>📋 Today's Missions</Text>
      {roomKeys.map((roomName, index) => {
        const roomTasks = groupedTasks[roomName];
        const totalPoints = roomTasks.reduce((sum, t) => sum + t.points, 0);
        return (
          <Animated.View
            key={roomName}
            style={[
              styles.card,
              {
                opacity: fadeAnimations.current[index],
                transform: [{ scale: scaleAnimations.current[index] }]
              }
            ]}
          >
            <Text style={styles.cardTitle}>🗺️ {roomName}</Text>
            <Text>{roomTasks.length} quest(s), {totalPoints} pts</Text>
            {roomTasks.map((task) => (
              <Text key={task.id} style={styles.taskItem}>
                ☐ {task.title} ({task.points} pts)
              </Text>
            ))}
          </Animated.View>
        );
      })}

      <Text style={styles.sectionHeader}>⚔️ Chore Battle</Text>
      {scoreboard.map((user, i) => (
        <View key={i} style={styles.scoreRow}>
          <Text style={styles.medal}>🏅</Text>
          <Text style={styles.scoreText}>{user.name}: {user.score} pts</Text>
        </View>
      ))}

      {goal && (
        <>
          <Text style={styles.sectionHeader}>🎯 Active Goal</Text>
          <Text>{goal.title}</Text>
          <Text>{goal.pointsEarned}/{goal.target} pts</Text>
        </>
      )}

      {challenge && (
        <>
          <Text style={styles.sectionHeader}>🎉 Daily Challenge</Text>
          <Text>{challenge.description}</Text>
        </>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Refresh" onPress={fetchData} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  hero: {
    backgroundColor: "#e3e0ff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#4b3b94" },
  subtitle: { fontSize: 16, color: "#555" },
  sectionHeader: { fontSize: 20, fontWeight: "bold", marginTop: 30, marginBottom: 10 },
  card: {
    backgroundColor: "#f4f4ff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  taskItem: { fontSize: 15, marginVertical: 2 },
  scoreRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  medal: { fontSize: 18, marginRight: 6 },
  scoreText: { fontSize: 16 },
  buttonContainer: { marginTop: 30, marginBottom: 60 }
});