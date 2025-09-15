import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { Swipeable } from "react-native-gesture-handler";

export default function AnimeListScreen() {
  const router = useRouter();
  const [animeTitle, setAnimeTitle] = useState("");
  const [animeList, setAnimeList] = useState([]);

  // ✅ auth check + Firestore listener
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setTimeout(() => router.replace("/login"), 0);
        return;
      }

      const q = query(
        collection(db, "animeList"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        setAnimeList(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });

      return unsubscribeFirestore;
    });

    return () => unsubscribeAuth();
  }, []);

  // ✅ add anime
  const addAnime = async () => {
    if (!animeTitle.trim()) return;

    await addDoc(collection(db, "animeList"), {
      title: animeTitle,
      uid: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });

    setAnimeTitle("");
  };

  // ✅ delete anime
  const deleteAnime = async (id) => {
    await deleteDoc(doc(db, "animeList", id));
  };

  // ✅ logout
  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  // Render swipeable item
  const renderAnime = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteAnime(item.id)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    >
      <View style={styles.card}>
        <Text style={styles.cardText}>{item.title}</Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Anime List</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Add Anime */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter anime title..."
          value={animeTitle}
          onChangeText={setAnimeTitle}
        />
        <TouchableOpacity style={styles.addButton} onPress={addAnime}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Anime List */}
      <FlatList
        data={animeList}
        keyExtractor={(item) => item.id}
        renderItem={renderAnime}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 47,
    marginTop: 50,
    alignItems: "center",
  },
  headerTitle: { fontSize: 27, fontWeight: "bold", color: "#222" },
  logout: { color: "#ff3b30", fontSize: 16 , },

  inputRow: { flexDirection: "row", marginBottom: 70 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    marginLeft: 8,
    borderRadius: 8,
    justifyContent: "center",
  },
  addText: { color: "#fff", fontWeight: "bold" },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: { fontSize: 18, color: "#333" },

  deleteButton: {
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginBottom: 10,
    borderRadius: 10,
  },
  deleteText: { color: "#fff", fontWeight: "bold" },
});
