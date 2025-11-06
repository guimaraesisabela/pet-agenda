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
    console.log('🟢 [AppointmentService] createAppointment iniciado:', { tutorId, tutorName, ...data });
    
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
      
      console.log('✅ [AppointmentService] Agendamento criado com ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("❌ [AppointmentService] Erro ao criar agendamento:", error);
      throw new Error("Não foi possível criar o agendamento");
    }
  }

  async getTutorAppointments(tutorId: string): Promise<Appointment[]> {
    console.log('🟢 [AppointmentService] getTutorAppointments iniciado para:', tutorId);
    
    try {
      const q = query(
        this.appointmentsRef,
        where("tutorId", "==", tutorId),
        orderBy("dateTime", "desc")
      );

      console.log('🟢 [AppointmentService] Executando query...');
      const querySnapshot = await getDocs(q);
      console.log('🟢 [AppointmentService] Documentos encontrados:', querySnapshot.size);
      
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
      console.error("❌ [AppointmentService] Erro ao buscar agendamentos do tutor:", error);
      throw new Error("Não foi possível buscar os agendamentos");
    }
  }

  async getAllAppointments(): Promise<Appointment[]> {
    console.log('🟢 [AppointmentService] getAllAppointments iniciado');
    
    try {
      const q = query(this.appointmentsRef, orderBy("dateTime", "asc"));

      console.log('🟢 [AppointmentService] Buscando todos os agendamentos...');
      const querySnapshot = await getDocs(q);
      console.log('🟢 [AppointmentService] Total de agendamentos:', querySnapshot.size);
      
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
      console.error("❌ [AppointmentService] Erro ao buscar todos os agendamentos:", error);
      throw new Error("Não foi possível buscar os agendamentos");
    }
  }

  async updateAppointmentStatus(
    appointmentId: string,
    status: "confirmed" | "rejected" | "completed",
    gestorNotes?: string
  ): Promise<void> {
    console.log('🟢 [AppointmentService] updateAppointmentStatus:', { appointmentId, status, gestorNotes });
    
    try {
      const appointmentDoc = doc(db, "appointments", appointmentId);
      const updateData: any = {
        status,
        updatedAt: serverTimestamp(),
      };

      if (gestorNotes !== undefined) {
        updateData.gestorNotes = gestorNotes;
      }

      console.log('🟢 [AppointmentService] Atualizando documento:', updateData);
      await updateDoc(appointmentDoc, updateData);
      console.log('✅ [AppointmentService] Documento atualizado com sucesso');
    } catch (error) {
      console.error("❌ [AppointmentService] Erro ao atualizar status:", error);
      throw new Error("Não foi possível atualizar o agendamento");
    }
  }
}

export const appointmentService = new AppointmentService();
console.log('🟢 [AppointmentService] Serviço instanciado');