export type Monthlydata = {
  id: string;
  month: string;
  inspectionsProgrammed: number;
  inspectionsCompleted: number;
  trainingProgrammed: number;
  trainingCompleted: number;
};

export const initialData2: Monthlydata[] = [
  {
    id: "1",
    month: "Enero",
    inspectionsProgrammed: 10,
    inspectionsCompleted: 8,
    trainingProgrammed: 5,
    trainingCompleted: 4,
  },
  {
    id: "2",
    month: "Febrero",
    inspectionsProgrammed: 12,
    inspectionsCompleted: 10,
    trainingProgrammed: 6,
    trainingCompleted: 6,
  },
  {
    id: "3",
    month: "Marzo",
    inspectionsProgrammed: 15,
    inspectionsCompleted: 13,
    trainingProgrammed: 8,
    trainingCompleted: 7,
  },
  {
    id: "4",
    month: "Abril",
    inspectionsProgrammed: 11,
    inspectionsCompleted: 9,
    trainingProgrammed: 7,
    trainingCompleted: 5,
  },
];
