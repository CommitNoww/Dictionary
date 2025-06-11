import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

export async function fetchSearchHistory() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.warn("사용자가 로그인되어 있지 않음");
        return resolve([]);
      }

      const q = query(
        collection(db, "searchHistory"),
        where("userId", "==", user.uid),
        orderBy("searchedAt", "desc")
      );

      try {
        const querySnapshot = await getDocs(q);
        const result = querySnapshot.docs.map(doc => ({
          word: doc.data().word,
          searchedAt: doc.data().searchedAt?.toDate?.(),
        }));
        console.log("검색 이력 불러오기 성공:", result);
        resolve(result);
      } catch (error) {
        console.error("검색 이력 불러오기 실패:", error);
        resolve([]);
      }
    });
  });
}
