import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { UserProfile, SessionTimeslot, StudioBatchSlot } from '../types';

const CLIENTS_COLLECTION = 'clients';
const SESSIONS_COLLECTION = 'sessions';
const STUDIO_COLLECTION = 'studio';
const STUDIO_CONFIG_DOC = 'config';

export interface StudioConfigData {
  batchSlots?: StudioBatchSlot[];
  studioTimeslots?: string[];
  instructorWhitelist?: string[];
}

/**
 * Subscribe to real-time client updates from Firestore.
 * Updates on any device (e.g. Instructor iPhone) trigger this callback instantly on Android & Web.
 */
export function subscribeToClients(
  onUpdate: (clients: UserProfile[]) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const clientsRef = collection(db, CLIENTS_COLLECTION);
    return onSnapshot(
      clientsRef,
      snapshot => {
        const clientList: UserProfile[] = [];
        snapshot.forEach(docSnap => {
          if (docSnap.exists()) {
            clientList.push(docSnap.data() as UserProfile);
          }
        });
        if (clientList.length > 0) {
          onUpdate(clientList);
        }
      },
      err => {
        console.warn('Firestore clients listener error:', err);
        onError?.(err);
      }
    );
  } catch (err) {
    console.warn('Failed to attach Firestore clients listener:', err);
    return () => {};
  }
}

/**
 * Save or update a single client profile in Firestore.
 */
export async function saveClientToFirestore(client: UserProfile): Promise<void> {
  try {
    const docRef = doc(db, CLIENTS_COLLECTION, client.id);
    await setDoc(docRef, JSON.parse(JSON.stringify(client)), { merge: true });
  } catch (err) {
    console.warn('Failed to save client to Firestore:', err);
  }
}

/**
 * Bulk save all clients to Firestore (e.g. for initial migration).
 */
export async function syncAllClientsToFirestore(clients: UserProfile[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    clients.forEach(client => {
      const docRef = doc(db, CLIENTS_COLLECTION, client.id);
      batch.set(docRef, JSON.parse(JSON.stringify(client)), { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.warn('Failed to sync all clients to Firestore:', err);
  }
}

/**
 * Delete a client from Firestore.
 */
export async function deleteClientFromFirestore(clientId: string): Promise<void> {
  try {
    const docRef = doc(db, CLIENTS_COLLECTION, clientId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Failed to delete client from Firestore:', err);
  }
}

/**
 * Subscribe to real-time session / booking updates.
 */
export function subscribeToSessions(
  onUpdate: (sessions: SessionTimeslot[]) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const sessionsRef = collection(db, SESSIONS_COLLECTION);
    return onSnapshot(
      sessionsRef,
      snapshot => {
        const sessionList: SessionTimeslot[] = [];
        snapshot.forEach(docSnap => {
          if (docSnap.exists()) {
            sessionList.push(docSnap.data() as SessionTimeslot);
          }
        });
        if (sessionList.length > 0) {
          onUpdate(sessionList);
        }
      },
      err => {
        console.warn('Firestore sessions listener error:', err);
        onError?.(err);
      }
    );
  } catch (err) {
    console.warn('Failed to attach Firestore sessions listener:', err);
    return () => {};
  }
}

/**
 * Save or update a session in Firestore.
 */
export async function saveSessionToFirestore(session: SessionTimeslot): Promise<void> {
  try {
    const docRef = doc(db, SESSIONS_COLLECTION, session.id);
    await setDoc(docRef, JSON.parse(JSON.stringify(session)), { merge: true });
  } catch (err) {
    console.warn('Failed to save session to Firestore:', err);
  }
}

/**
 * Bulk sync sessions to Firestore.
 */
export async function syncAllSessionsToFirestore(sessions: SessionTimeslot[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    sessions.forEach(session => {
      const docRef = doc(db, SESSIONS_COLLECTION, session.id);
      batch.set(docRef, JSON.parse(JSON.stringify(session)), { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.warn('Failed to sync sessions to Firestore:', err);
  }
}

/**
 * Delete a session from Firestore.
 */
export async function deleteSessionFromFirestore(sessionId: string): Promise<void> {
  try {
    const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Failed to delete session from Firestore:', err);
  }
}

/**
 * Subscribe to studio configuration (batch slots, timeslots, instructor whitelist).
 */
export function subscribeToStudioConfig(
  onUpdate: (config: StudioConfigData) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const configDocRef = doc(db, STUDIO_COLLECTION, STUDIO_CONFIG_DOC);
    return onSnapshot(
      configDocRef,
      snapshot => {
        if (snapshot.exists()) {
          onUpdate(snapshot.data() as StudioConfigData);
        }
      },
      err => {
        console.warn('Firestore studio config listener error:', err);
        onError?.(err);
      }
    );
  } catch (err) {
    console.warn('Failed to attach Firestore config listener:', err);
    return () => {};
  }
}

/**
 * Save studio configuration updates (batch slots, timeslots, instructor whitelist).
 */
export async function saveStudioConfigToFirestore(config: StudioConfigData): Promise<void> {
  try {
    const configDocRef = doc(db, STUDIO_COLLECTION, STUDIO_CONFIG_DOC);
    await setDoc(configDocRef, JSON.parse(JSON.stringify(config)), { merge: true });
  } catch (err) {
    console.warn('Failed to save studio config to Firestore:', err);
  }
}

