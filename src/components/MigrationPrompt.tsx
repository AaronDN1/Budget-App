import { CloudUpload } from "lucide-react";

interface MigrationPromptProps {
  saving: boolean;
  onImport: () => Promise<void>;
  onSkip: () => Promise<void>;
  onLater: () => void;
}

export default function MigrationPrompt({ saving, onImport, onSkip, onLater }: MigrationPromptProps) {
  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-lg border border-blue-200 bg-white p-4 shadow-soft dark:border-blue-900 dark:bg-slate-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="h-fit rounded-lg bg-blue-50 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><CloudUpload className="h-5 w-5" /></div>
          <div>
            <h2 className="font-black text-slate-950 dark:text-white">Import local budget data?</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              We found budget data saved on this device. Do you want to import it into your cloud account so it syncs across devices?
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button className="btn-primary" type="button" disabled={saving} onClick={onImport}>Import to Cloud</button>
          <button className="btn-secondary" type="button" disabled={saving} onClick={onSkip}>Skip</button>
          <button className="btn-secondary" type="button" disabled={saving} onClick={onLater}>Remind Me Later</button>
        </div>
      </div>
    </div>
  );
}
