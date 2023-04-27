import { faker } from "@faker-js/faker";
import {
  generateId,
  generateName,
  generateProjectName,
} from "modules/core/project-utils";
import DiffViewer from "react-diff-viewer";

export type NotificationType = "comment" | "new-pr" | "fork" | "invite";
export type Notification = {
  id: string;
  author: string;
  avatar: string;
  boardId: string;
  boardName: string;
  type: NotificationType;
};

export interface NotificationProps {
  notification: Notification;
}

export interface NotificationsProps {
  notifications: Notification[];
}

const Avatar = ({ url }: { url: string }) => {
  return <img src={url} className="w-12 h-12 rounded-full" />;
};

const CommentNotification = (n: Notification) => {
  return (
    <>
      <Avatar url={n.avatar} />
      <div className="flex flex-col">
        <div>
          <div className="flex flex-col"></div>
          <span className="font-semibold">{n.author}</span> replied to you on{" "}
          <span className="font-semibold">{n.boardName}</span>
        </div>
        <div className="bg-slate-100 flex items-end gap-1">
          <div className="border-l-2 h-10 border-slate-500"></div>
          <div className="">This seems like a better way to put it</div>
        </div>
      </div>
    </>
  );
};

const NewPrNotification = (n: Notification) => {
  return (
    <>
      <Avatar url={n.avatar} />
      <div className="flex flex-col">
        <div>
          <span className="font-semibold">{n.author}</span> suggested changes to{" "}
          <span className="font-semibold">{n.boardName}</span>
        </div>
        <div>
          <DiffViewer
            splitView={false}
            oldValue="I prefer not to say"
            newValue="Some things are best left unsaid"
          ></DiffViewer>
        </div>
      </div>
    </>
  );
};

const ForkNotification = (n: Notification) => {
  return (
    <>
      <Avatar url={n.avatar} />
      <div className="flex flex-col">
        <div>
          <span className="font-semibold">{n.author}</span> wants to make
          changes on <span className="font-semibold">{n.boardName}</span>
        </div>
        <div className="bg-slate-100 flex items-end gap-1">
          <div className="border-l-2 h-10 border-slate-500"></div>
          <div className="">This is where it gets interesting</div>
        </div>
      </div>
    </>
  );
};

const InviteNotification = (n: Notification) => {
  return (
    <>
      <Avatar url={n.avatar} />
      <div>
        <span className="font-semibold">{n.author}</span> invites you to
        collaborate on {""}
        <span className="font-semibold">{n.boardName}</span>
      </div>
    </>
  );
};

const NotificationType = (n: Notification) => {
  switch (n.type) {
    case "comment":
      return <CommentNotification {...n} />;
    case "fork":
      return <ForkNotification {...n} />;
    case "new-pr":
      return <NewPrNotification {...n} />;
    case "invite":
      return <InviteNotification {...n} />;
  }
};

const NotificationView = ({ notification }: NotificationProps) => {
  return (
    <div className="flex items-center p-5 gap-5">
      <NotificationType {...notification} />
    </div>
  );
};

const generateFakeNotifications = (): Notification[] => {
  const types: NotificationType[] = [
    "new-pr",
    "invite",
    "comment",
    "fork",
    "invite",
  ];

  return types.map((type) => ({
    type,
    author: generateName(),
    avatar: faker.image.avatar(),
    boardId: generateId(),
    boardName: generateProjectName(),
    id: generateId(),
  }));
};

const Notifications = () => {
  const notifications = generateFakeNotifications();
  return (
    <div className="">
      {notifications.map((n) => {
        return <NotificationView key={n.id} notification={n} />;
      })}
    </div>
  );
};

export default Notifications;
