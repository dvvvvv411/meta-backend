import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Paperclip, Send, Loader2 } from "lucide-react";
import { useTicketMessages, useCreateMessage, TicketMessage } from "@/hooks/useTicketMessages";
import { useUploadAttachment } from "@/hooks/useTicketAttachments";
import { useAuth } from "@/contexts/AuthContext";
import { TicketMessageItem } from "./TicketMessageItem";

interface TicketChatProps {
  ticketId: string;
}

export function TicketChat({ ticketId }: TicketChatProps) {
  const { user } = useAuth();
  const { data: messages, isLoading } = useTicketMessages(ticketId);
  const createMessage = useCreateMessage();
  const uploadAttachment = useUploadAttachment();
  
  const [content, setContent] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!content.trim() || !user) return;

    const messageResult = await createMessage.mutateAsync({
      ticketId,
      content: content.trim(),
      isInternal,
      userId: user.id,
    });

    if (attachedFile && messageResult) {
      await uploadAttachment.mutateAsync({
        ticketId,
        messageId: messageResult.id,
        file: attachedFile,
        userId: user.id,
      });
    }

    setContent("");
    setIsInternal(false);
    setAttachedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setAttachedFile(file);
    }
  };

  const isPending = createMessage.isPending || uploadAttachment.isPending;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Noch keine Nachrichten
          </div>
        ) : (
          messages?.map((message: TicketMessage) => (
            <TicketMessageItem key={message.id} message={message} />
          ))
        )}
      </div>

      <div className="border-t p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="internal"
            checked={isInternal}
            onCheckedChange={(checked) => setIsInternal(checked === true)}
          />
          <Label htmlFor="internal" className="text-sm text-muted-foreground">
            Interne Notiz (nur für Admins sichtbar)
          </Label>
        </div>

        <Textarea
          placeholder={isInternal ? "Interne Notiz schreiben..." : "Antwort schreiben..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`min-h-[100px] ${isInternal ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950" : ""}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              handleSend();
            }
          }}
        />

        {attachedFile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Paperclip className="h-4 w-4" />
            {attachedFile.name}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAttachedFile(null)}
              className="h-6 px-2"
            >
              ×
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4 mr-1" />
            Datei anhängen
          </Button>

          <Button onClick={handleSend} disabled={!content.trim() || isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Send className="h-4 w-4 mr-1" />
            )}
            Senden
          </Button>
        </div>
      </div>
    </div>
  );
}
