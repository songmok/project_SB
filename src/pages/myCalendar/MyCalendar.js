import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { MyCalendarCss } from "./style/MyCalendarCss";
import axios from "axios";
import instance from "api/instance";
import request from "api/request";
import MyCalendarSchedule from "components/myCalendar/listBook/MyCalendarSchedule";

import MyCalendarModal from "components/myCalendar/myCalendarModal/MyCalendarModal";
import ListBook from "components/myCalendar/listBook/ListBook";
import MySeleteModal from "components/myCalendar/listBook/MySeleteModal";
import moment from "moment";

const MyCalendar = () => {
  // States
  // 모달
  const [modalOpen, setModalOpen] = useState(false);
  const [slecteModal, setSlecteModal] = useState(false);
  // const [selectedModal, setSelectedModal] = useState("");
  // 이벤트
  const [event, setEvnet] = useState([]);
  // 리스트
  const [plan, setPlan] = useState([]);
  const [ing, setIng] = useState([]);
  // 책 seq
  const [modalData, setModalData] = useState();
  // 유저 Seq
  const uiSeq = useSelector((state) => state.user.uiSeq);
  // date start end
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [selectStart, setSelectStart] = useState(new Date());
  const [selectEnd, setSelectEnd] = useState(new Date());
  // useForm handler
  const { register, handleSubmit } = useForm();
  // 일정추가
  const addEvent = async () => {
    let user = {
      uiSeq: uiSeq,
    };
    await axios
      .get(`http://192.168.0.160:8520/api/schedule/my`, {
        params: user,
      })
      .then((res) => {
        console.log("addDate", res.data);
        // res.data.end += "T23:59:00";
        for (let temp of res.data) {
          let tomorrow = new Date(temp.end);
          tomorrow.setDate(tomorrow.getDate() + 1);
          // console.log(tomorrow);
          temp.end = moment(tomorrow).format("YYYY-MM-DD");
          // console.log(temp.end);
          console.log("df", temp);
        }

        setEvnet(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // 캘린더에서 삭제
  const deleteEvnet = (e) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      const siSeq = e.event._def;
      instance
        .delete(request.scheduleDelete, {
          params: {
            id: siSeq.publicId,
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // booklist
  const listPlan = async () => {
    const params = {
      uiSeq: uiSeq,
    };
    await instance.get(request.listPlan, { params: params }).then((res) => {
      console.log(res.data.mybookList);
      setPlan(res.data.mybookList);
    });
  };
  const listIng = async () => {
    const params = {
      uiSeq: uiSeq,
    };
    await instance.get(request.myCalendar, { params: params }).then((res) => {
      setIng(res.data);
      console.log("서버에서 불러옴 일정리스트", res.data);
    });
  };
  useEffect(() => {
    addEvent();
    listPlan();
    listIng();
  }, []);

  //
  const openForm = () => {
    // setSelectedModal(true);
    openModal();
  };
  const openModal = () => {
    setModalOpen(true);
  };
  // Close Modal Function
  const closeModal = () => {
    setModalOpen(false);
  };

  // select modal
  const selectModalOpen = () => {
    setSlecteModal(true);
  };
  const selectModalClose = () => {
    setSlecteModal(false);
  };
  return (
    <MyCalendarCss>
      <ListBook plan={plan} openForm={openForm} setModalData={setModalData} />
      <MyCalendarSchedule
        ing={ing}
        openForm={openForm}
        setModalData={setModalData}
        start={start}
        end={end}
      />
      <MyCalendarModal
        modalData={modalData}
        closeModal={closeModal}
        modalOpen={modalOpen}
        start={start}
        setStart={setStart}
        end={end}
        setEnd={setEnd}
        handleSubmit={handleSubmit}
        register={register}
        uiSeq={uiSeq}
        listIng={listIng}
      />
      <MySeleteModal
        uiSeq={uiSeq}
        setSelectStart={setSelectStart}
        setSelectEnd={setSelectEnd}
        plan={plan}
        slecteModal={slecteModal}
        handleSubmit={handleSubmit}
        register={register}
        selectModalOpen={selectModalOpen}
        selectModalClose={selectModalClose}
        listIng={listIng}
        selectStart={selectStart}
        selectEnd={selectEnd}
      />
      <div className="fullcalendarWrap">
        {uiSeq ? (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "title",
              right: "prevYear,prev,today,next,nextYear",
            }}
            eventClick={deleteEvnet}
            initialView="dayGridMonth"
            events={event}
            droppable={false}
            allDaySlot={false}
            defaultAllDay={false}
            editable={true}
            selectable={true}
            select={(data) => {
              selectModalOpen(true);
              setSelectStart(data.startStr);
              console.log("셀렉트 날짜 끝1", data.endStr);
              let tomorrow = new Date(data.endStr);
              tomorrow.setDate(tomorrow.getDate() - 1);
              console.log("셀렉트 날짜 끝2", tomorrow);
              data.endStr = moment(tomorrow).format("YYYY-MM-DD");
              console.log(data.endStr);
              setSelectEnd(data.endStr);
              console.log("datae", data);
            }}
            selectMirror={false}
            displayEventTime={false}
            weekends={true}
            locale={"ko"}
            eventStartEditable={false}
            // views={{
            //   dayGrid: {
            //     dayMaxEventRows: 4,
            //   },
            // }}
            height={"85vh"}
            width={"85vw"}
          />
        ) : (
          <div>Loading</div>
        )}
      </div>
    </MyCalendarCss>
  );
};

export default MyCalendar;
