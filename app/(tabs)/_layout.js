import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConfettiCannon from "react-native-confetti-cannon"; // npm install react-native-confetti-cannon
import * as Progress from "react-native-progress"; // expo install react-native-progress

export default function Index() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [scoreboard, setScoreboard] = useState([]);
  const [goal, setGoal] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const uid = await AsyncStorage.getItem("user_id");
      const uname = await AsyncStorage.getItem("username");
      setUserId(uid);
      setUsername(uname || "Adventurer");
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchData(userId);
    }
  }, [userId]);

  const fetchData = async (uid) => {
    try {
      const [taskRes, scoreRes, goalRes] = await Promise.all([
        fetch(`https://YOUR_BACKEND/user-tasks?user_id=${uid}`),
        fetch(`https://YOUR_BACKEND/user-scoreboard`),
        fetch(`https://YOUR_BACKEND/user-goal?user_id=${uid}`)
      ]);
      const tasksData = await taskRes.json();
      const scoreboardData = await scoreRes.json();
      const goalData = await goalRes.json();

      setTasks(tasksData);
      setScoreboard(scoreboardData);
      setGoal(goalData);
      setChallenge({
        description: "Wipe down all surfaces in one room ✨"
      });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    const room = task.room?.name || "Unassigned";
    if (!acc[room]) acc[room] = [];
    acc[room].push(task);
    return acc;
  }, {});

  const completeTask = async (task) => {
    if (completedTasks.includes(task.id)) return;
    try {
      await fetch("https://YOUR_BACKEND/complete-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, task_id: task.id })
      });
      setCompletedTasks((prev) => [...prev, task.id]);

      // Check for goal completion
      if (goal && goal.pointsEarned + task.points >= goal.target) {
        setShowConfetti(true);
      }
    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>ChoreQuest</Text>
        <Text style={styles.subtitle}>Welcome back, {username} 🧙</Text>
      </View>

      <Text style={styles.sectionHeader}>📋 Today's Missions</Text>
      {Object.entries(groupedTasks).map(([roomName, roomTasks]) => {
        const totalPoints = roomTasks.reduce((sum, t) => sum + t.points, 0);
        return (
          <View key={roomName} style={styles.card}>
            <Text style={styles.cardTitle}>🗺️ {roomName}</Text>
            <Text>{roomTasks.length} quest(s), {totalPoints} pts</Text>
            {roomTasks.map((task) => {
              const isDone = completedTasks.includes(task.id);
              return (
                <TouchableOpacity
                  key={task.id}
                  style={[
                    styles.taskItemTouchable,
                    isDone && { backgroundColor: "#d0ffd6" }
                  ]}
                  onPress={() => completeTask(task)}
                >
                  <Text
                    style={[
                      styles.taskItem,
                      isDone && {
                        textDecorationLine: "line-through",
                        color: "#555"
                      }
                    ]}
                  >
                    {isDone ? "✅" : "☐"} {task.title} ({task.points} pts)
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      })}

      {goal && (
        <>
          <Text style={styles.sectionHeader}>🎯 Goal Progress</Text>
          <Text>{goal.title}</Text>
          <Progress.Bar
            progress={goal.pointsEarned / goal.target}
            width={null}
            color="#4b3b94"
            borderRadius={6}
            style={{ marginVertical: 10 }}
          />
          <Text>{goal.pointsEarned}/{goal.target} pts</Text>
        </>
      )}

      <Text style={styles.sectionHeader}>⚔️ Chore Battle</Text>
      {scoreboard.map((user, i) => (
        <TouchableOpacity
          key={i}
          style={styles.scoreRow}
          onPress={() => alert(`${user.name} clicked!`)}
        >
          <Text style={styles.medal}>🏅</Text>
          <Text style={styles.scoreText}>{user.name}: {user.score} pts</Text>
        </TouchableOpacity>
      ))}

      {challenge && (
        <>
          <Text style={styles.sectionHeader}>🎉 Daily Challenge</Text>
          <TouchableOpacity
            style={[
              styles.card,
              challengeAccepted && { backgroundColor: "#d0eaff" }
            ]}
            onPress={() => setChallengeAccepted(true)}
          >
            <Text>
              {challengeAccepted ? "✅ Challenge Accepted!" : challenge.description}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {showConfetti && (
        <ConfettiCannon count={120} origin={{ x: 200, y: 0 }} />
      )}
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
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10
  },
  card: {
    backgroundColor: "#f4f4ff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  taskItemTouchable: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
    marginVertical: 4,
    elevation: 2
  },
  taskItem: { fontSize: 15 },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4
  },
  medal: { fontSize: 18, marginRight: 6 },
  scoreText: { fontSize: 16 }
});