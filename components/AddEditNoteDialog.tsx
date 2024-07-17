"use client";
import { createPatientSchema } from "@/lib/validation/note";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";

import LoadingButton from "../LoadingButton";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { Patient } from "@prisma/client";

interface AddEditNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  patientToEdit?: Patient;
}

type FieldNames =
  | "fullName"
  | "age"
  | "gender"
  | "phoneNumber"
  | "email"
  | "address"
  | "emergencyContacts"
  | "medicalHistories"
  | "psychiatricHistories"
  | "intakeAssessments"
  | "additionalNotes"
  | "medicalCondition"
  | "maritalStatus"
  | "smokingStatus"
  | "insuranceCarrier"
  | "alcoholConsumption"
  | "physicalActivity"
  | "dietaryHabits"
  | "policyNumber"
  | "groupID"
  | "occupation"
  | "height"
  | "supportSystem"
  | "weight"
  | "educationLevel"
  | "insuranceContactNumber"
  | "livingArrangement";

interface FieldMapping {
  label: string;
  name: FieldNames; // Adjust the type if you have a specific type for field names.
}
interface CreatePatientSchema {
  fullName: string;
  age: string;
  gender: string;
  maritalStatus?: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  emergencyContacts?: string;
  medicalHistories?: string;
  psychiatricHistories?: string;
  intakeAssessments?: string;
  additionalNotes?: string;
  medicalCondition?: string;

  smokingStatus?: string;
  insuranceCarrier?: string;
  alcoholConsumption?: string;
  physicalActivity?: string;
  dietaryHabits?: string | "";
  policyNumber?: string;
  groupID?: string;
  occupation?: string;
  height?: string;
  supportSystem?: string;
  weight?: string | undefined;
  educationLevel?: string;
  insuranceContactNumber?: string;
  livingArrangement?: string;
}

const fields: FieldMapping[] = [
  { label: "Full Name", name: "fullName" },
  { label: "Age", name: "age" },
  { label: "Gender", name: "gender" },
  { label: "Phone Number", name: "phoneNumber" },
  { label: "Email", name: "email" },
  { label: "Current Address", name: "address" },
  { label: "Emergency Contacts", name: "emergencyContacts" },
  { label: "Medical Histories", name: "medicalHistories" },
  { label: "Psychiatric Histories", name: "psychiatricHistories" },
  { label: "Intake Assessments", name: "intakeAssessments" },
  { label: "Additional Notes", name: "additionalNotes" },
  { label: "Medical Condition", name: "medicalCondition" },
  { label: "Marital Status", name: "maritalStatus" },
  { label: "Smoking Status", name: "smokingStatus" },
  { label: "Insurance Carrier", name: "insuranceCarrier" },
  { label: "Alcohol Consumption", name: "alcoholConsumption" },
  { label: "Physical Activity", name: "physicalActivity" },
  { label: "Dietary Habits", name: "dietaryHabits" },
  { label: "Policy Number", name: "policyNumber" },
  { label: "Group ID", name: "groupID" },
  { label: "Occupation", name: "occupation" },
  { label: "Height (cm)", name: "height" },
  { label: "Weight (kg)", name: "weight" },
  { label: "Support System", name: "supportSystem" },
  { label: "Education Level", name: "educationLevel" },
  { label: "Insurance Contact Number", name: "insuranceContactNumber" },
  { label: "Living Arrangement", name: "livingArrangement" },
];

export default function AddEditNoteDialog({
  open,
  setOpen,
  patientToEdit,
}: AddEditNoteDialogProps) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();
  const form = useForm<CreatePatientSchema>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      fullName: patientToEdit?.fullName || "",
      age: patientToEdit?.age || "",
      gender: patientToEdit?.gender || "",
      maritalStatus: patientToEdit?.maritalStatus || "",
      phoneNumber: patientToEdit?.phoneNumber || "",
      email: patientToEdit?.email || "",
      address: patientToEdit?.address || "",
      emergencyContacts: patientToEdit?.emergencyContacts || "",
      insuranceCarrier: patientToEdit?.insuranceCarrier || "",
      policyNumber: patientToEdit?.policyNumber || "",
      groupID: patientToEdit?.groupID || "",
      height: patientToEdit?.height || "",
      weight: patientToEdit?.weight || "",
      smokingStatus: patientToEdit?.smokingStatus || "",
      alcoholConsumption: patientToEdit?.alcoholConsumption || "",
      physicalActivity: patientToEdit?.physicalActivity || "",
      dietaryHabits: patientToEdit?.dietaryHabits || "",
      occupation: patientToEdit?.occupation || "",
      educationLevel: patientToEdit?.educationLevel || "",
      livingArrangement: patientToEdit?.livingArrangement || "",
      supportSystem: patientToEdit?.supportSystem || "",
      medicalHistories: patientToEdit?.medicalHistories || "",
      psychiatricHistories: patientToEdit?.psychiatricHistories || "",
      intakeAssessments: patientToEdit?.intakeAssessments || "",
      additionalNotes: patientToEdit?.additionalNotes || "",
      medicalCondition: patientToEdit?.medicalCondition || "",
      /* 
   
    
  
  
    
     
   
 
  
    

      
   
   


      insuranceContactNumber: patientToEdit?.insuranceContactNumber || "",
       */
    },
  });

  async function onSubmit(input: CreatePatientSchema) {
    try {
      if (patientToEdit) {
        const response = await fetch("/api/notes", {
          method: "PUT",
          body: JSON.stringify({ id: patientToEdit?.id, ...input }),
        });
        if (!response.ok) throw Error("status code " + response.status);
      } else {
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify(input),
        });

        if (!response.ok) throw Error("status code " + response.status);

        form.reset();
      }

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteNote() {
    if (!patientToEdit) return;
    try {
      setDeleteInProgress(true);
      const response = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({ id: patientToEdit?.id }),
      });

      if (!response.ok) throw Error("status code " + response.status);

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="my-2 h-[100vh] w-full max-w-7xl overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>
            {patientToEdit ? "Edit Patient" : "Add Patient"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <h3 className="font-bold">Patient Identification</h3>
            <FormField
              key="fullName"
              control={form.control}
              name="fullName"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              key="age"
              control={form.control}
              name="age"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input placeholder="Age" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              key="gender"
              control={form.control}
              name="gender"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Input placeholder="Gender" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              key="maritalStatus"
              control={form.control}
              name="maritalStatus"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Marital Status</FormLabel>
                  <FormControl>
                    <Input placeholder="Marital Status" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              key="medicalCondition"
              control={form.control}
              name="medicalCondition"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Medical Condition</FormLabel>
                  <FormControl>
                    <Input placeholder="Medical Condition" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h3 className="font-bold">Contact Information</h3>
            <FormField
              key="phoneNumber"
              control={form.control}
              name="phoneNumber"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              key="email"
              control={form.control}
              name="email"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>ُEmail</FormLabel>
                  <FormControl>
                    <Input placeholder="ُEmail" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              key="address"
              control={form.control}
              name="address"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Current address</FormLabel>
                  <FormControl>
                    <Input placeholder="Current address" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              key="emergencyContacts"
              control={form.control}
              name="emergencyContacts"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Emergency Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Emergency Contact" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3 className="font-bold">Insurance Information</h3>

            <FormField
              key="insuranceCarrier"
              control={form.control}
              name="insuranceCarrier"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Primary Insurance Carrier</FormLabel>
                  <FormControl>
                    <Input placeholder="john dou" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              key="policyNumber"
              control={form.control}
              name="policyNumber"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Policy Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Policy Number" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              key="groupID"
              control={form.control}
              name="groupID"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Group ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Group ID" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3 className="font-bold">Body Information</h3>
            <FormField
              key="height"
              control={form.control}
              name="height"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input placeholder="140cm" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              key="weight"
              control={form.control}
              name="weight"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Weight (KG)</FormLabel>
                  <FormControl>
                    <Input placeholder="80kg" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3 className="font-bold">Lifestyle Information</h3>
            <FormField
              key="smokingStatus"
              control={form.control}
              name="smokingStatus"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Smoking Status</FormLabel>
                  <FormControl>
                    <Input placeholder="no smoke" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              key="alcoholConsumption"
              control={form.control}
              name="alcoholConsumption"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Alcohol Consumption</FormLabel>
                  <FormControl>
                    <Input placeholder="heavy" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              key="physicalActivity"
              control={form.control}
              name="physicalActivity"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Physical Activity</FormLabel>
                  <FormControl>
                    <Input placeholder="i play some football" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              key="dietaryHabits"
              control={form.control}
              name="dietaryHabits"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Dietary Habits</FormLabel>
                  <FormControl>
                    <Input placeholder="no diet" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3 className="font-bold">Social History</h3>
            <FormField
              key="occupation"
              control={form.control}
              name="occupation"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <Input placeholder="teacher" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              key="educationLevel"
              control={form.control}
              name="educationLevel"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Education Level</FormLabel>
                  <FormControl>
                    <Input placeholder="bachelor's" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              key="livingArrangement"
              control={form.control}
              name="livingArrangement"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Living Arrangement</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(e.g., alone, with family)"
                      {...formField}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              key="supportSystem"
              control={form.control}
              name="supportSystem"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Support Group</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(e.g., family, friends)"
                      {...formField}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              key="medicalHistories"
              control={form.control}
              name="medicalHistories"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Medical Histories</FormLabel>
                  <FormControl>
                    <Input placeholder="none" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              key="psychiatricHistories"
              control={form.control}
              name="psychiatricHistories"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Psychiatric Histories</FormLabel>
                  <FormControl>
                    <Input placeholder="psychiatricHistories" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              key="intakeAssessments"
              control={form.control}
              name="intakeAssessments"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Intake Assessments</FormLabel>
                  <FormControl>
                    <Input placeholder="intakeAssessments" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              key="additionalNotes"
              control={form.control}
              name="additionalNotes"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="additionalNotes" {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {patientToEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteNote}
                  type="button"
                >
                  Delete Patient
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
