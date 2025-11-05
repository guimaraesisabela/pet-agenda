import {
    addDoc,
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Appointment {
  id?: string;
  tutorId: string;
  tutorName: string;
  petName: string;
  service: string;
  dateTime: Date;
  status: "pending" | "confirmed" | "rejected" | "completed";
  gestorNotes: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class AppointmentService {
  private appointmentsRef = collection(db, "appointments");

  async createAppointment(
    tutorId: string,
    tutorName: string,
    data: {
      petName: string;
      service: string;
      dateTime: Date;
    }
  ): Promise<string> {
    try {
      const docRef = await addDoc(this.appointmentsRef, {
        tutorId,
        tutorName,
        petName: data.petName,
        service: data.service,
        dateTime: Timestamp.fromDate(data.dateTime),
        status: "pending",
        gestorNotes: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      throw new Error("Não foi possível criar o agendamento");
    }
  }

  async getTutorAppointments(tutorId: string): Promise<Appointment[]> {
    try {
      const q = query(
        this.appointmentsRef,
        where("tutorId", "==", tutorId),
        orderBy("dateTime", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          tutorId: data.tutorId,
          tutorName: data.tutorName,
          petName: data.petName,
          service: data.service,
          dateTime: data.dateTime.toDate(),
          status: data.status,
          gestorNotes: data.gestorNotes || "",
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };
      });
    } catch (error) {
      console.error("Erro ao buscar agendamentos do tutor:", error);
      throw new Error("Não foi possível buscar os agendamentos");
    }
  }

  async getAllAppointments(): Promise<Appointment[]> {
    try {
      const q = query(this.appointmentsRef, orderBy("dateTime", "asc"));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          tutorId: data.tutorId,
          tutorName: data.tutorName,
          petName: data.petName,
          service: data.service,
          dateTime: data.dateTime.toDate(),
          status: data.status,
          gestorNotes: data.gestorNotes || "",
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };
      });
    } catch (error) {
      console.error("Erro ao buscar todos os agendamentos:", error);
      throw new Error("Não foi possível buscar os agendamentos");
    }
  }

  async updateAppointmentStatus(
    appointmentId: string,
    status: "confirmed" | "rejected" | "completed",
    gestorNotes?: string
  ): Promise<void> {
    try {
      const appointmentDoc = doc(db, "appointments", appointmentId);
      const updateData: any = {
        status,
        updatedAt: serverTimestamp(),
      };

      if (gestorNotes !== undefined) {
        updateData.gestorNotes = gestorNotes;
      }

      await updateDoc(appointmentDoc, updateData);
    } catch (error) {
      console.error("Erro ao atualizar status do agendamento:", error);
      throw new Error("Não foi possível atualizar o agendamento");
    }
  }
}

export const appointmentService = new AppointmentService();