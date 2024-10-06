"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ID } from "node-appwrite";
import {
  // BUCKET_ID,
  database,
  DATABASE_ID,
  // ENDPOINT,
  APPOINTMENT_COLLECTION_ID,
  // PROJECT_ID,
  // users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

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
