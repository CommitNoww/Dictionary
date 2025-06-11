import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

export async function saveSearchHistory(word) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await addDoc(collection(db, "searchHistory"), {
      userId: user.uid,
      word: word,
      searchedAt: serverTimestamp(),
    });
    console.log("검색 이력 저장 완료:", word);
  } catch (error) {
    console.error("검색 이력 저장 실패:", error);
  }
}