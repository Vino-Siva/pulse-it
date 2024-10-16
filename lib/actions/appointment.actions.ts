"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ID, Query } from "node-appwrite";
import {
  // BUCKET_ID,
  database,
  DATABASE_ID,
  // ENDPOINT,
  APPOINTMENT_COLLECTION_ID,
  message,
  // PROJECT_ID,
  // users,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await database.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );
    return parseStringify(newAppointment);
  } catch (error: any) {
    console.error("Error creating appointment:", error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await database.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointment);
  } catch (error) {
    console.error("Error getting appointment:", error);
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await database.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === "Scheduled") acc.scheduledCount += 1;
        if (appointment.status === "Pending") acc.pendingCount += 1;
        if (appointment.status === "Cancelled") acc.cancelledCount += 1;

        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error("Unable to get Recent Appointments List", error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await database.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) throw new Error("Appointment not found");

    const smsMessage = `
      Hi, it's Pulse-It. 
      ${
        type === "schedule"
          ? `Your appointment has been scheduled for ${
              formatDateTime(appointment.schedule!).dateTime
            } with Dr. ${appointment.primaryPhysician!}`
          : `We regret to inform you that your appointment has been cancelled due to following reason: ${appointment.cancellationReason!}.`
      }
    `;
    await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
  }
};

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const messageToSend = await message.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );

    return parseStringify(messageToSend);
  } catch (error) {
    console.error("Unable to send SMS message: ", error);
  }
};
