import { AppShell } from "./AppShell/index.js";
import { Sidebar } from "./Sidebar/index.js";
import { TopHeader } from "./TopHeader/index.js";
import { Breadcrumbs } from "./Breadcrumbs/index.js";
import { WorkbookToolbar } from "./WorkbookToolbar/index.js";
import { WorkbookViewer } from "./WorkbookViewer/index.js";
import { WorkbookPage } from "./WorkbookPage/index.js";
import { InteractiveField } from "./InteractiveField/index.js";
import { MatchingExercise } from "./MatchingExercise/index.js";
import { MultipleChoiceExercise } from "./MultipleChoiceExercise/index.js";
import { RightAssistantPanel } from "./RightAssistantPanel/index.js";
import { BottomActionBar } from "./BottomActionBar/index.js";
import { SaveStatus } from "./SaveStatus/index.js";
import { ProgressWidget } from "./ProgressWidget/index.js";

export const LMS_COMPONENTS = [
  AppShell,
  Sidebar,
  TopHeader,
  Breadcrumbs,
  WorkbookToolbar,
  WorkbookViewer,
  WorkbookPage,
  InteractiveField,
  MatchingExercise,
  MultipleChoiceExercise,
  RightAssistantPanel,
  BottomActionBar,
  SaveStatus,
  ProgressWidget
];

export function registerShellComponents(root = document) {
  return LMS_COMPONENTS.map((component) => ({
    ...component,
    mounted: Boolean(root.querySelector(component.selector))
  }));
}
