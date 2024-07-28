import EventModule from "@/lib/decorators/EventModule";
import CheckIn from "@/events/chat/Checkin";
import KickMember from "@/events/chat/KickMember";
import Meeting from "@/events/chat/Meeting";
import Mention from "@/events/chat/Mentions";
import Rule from "@/events/chat/Rules";
import GetId from "@/events/chat/GetId";
import GetCheckInList from "@/events/chat/GetCheckInList";
import UserGetRole from "@/events/chat/UserGetRole";
import EndMeeting from "@/events/chat/EndMeeting";
import AllowCheckIn from "@/events/chat/AllowCheckIn";
import CloseCheckIn from "@/events/chat/CloseCheckIn";
import Demo from "@/events/chat/Demo";
import MyPoint from "@/events/chat/MyPoint";
import Leaderboard from "@/events/chat/Leaderboard";
import Ask from "@/events/chat/Ask";

@EventModule({
    Event: "MessageCreate",
    Handler: [
        Demo,
        Ask,
        CheckIn,
        MyPoint,
        EndMeeting,
        KickMember,
        Meeting,
        Mention,
        Rule,
        GetId,
        GetCheckInList,
        UserGetRole,
        AllowCheckIn,
        CloseCheckIn,
        Leaderboard,
    ],
})
class MessageCreate {}

export default MessageCreate;
