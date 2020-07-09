package edu.baylor.ems.component;

import edu.baylor.ems.model.Exam;
import edu.baylor.ems.repository.ExamRepository;
import edu.baylor.ems.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Component
public class TaskScheduling {

    @Autowired
    private EmailService emailService;

    @Autowired
    private ExamRepository examRepository;

    @Scheduled(cron = "0 0 9 * * ?") // every day at 9 am
//    @Scheduled(cron = "0/30 * * * * ?") // every 30 seconds, for testing
    public void sendExamReminders() {

        Date today = new Date();
        Calendar c = Calendar.getInstance();
        c.setTime(today);
        c.add(Calendar.DATE, 1);
        Date tomorrow = c.getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
//        System.out.println("Tomorrow: " + dateFormat.format(tomorrow)); //2016/11/16 12:08:43

        // Note: calendar.get(Calendar.MONTH) returns 0 for January, 1 for February, and so on. only MONTH
        List<Exam> examsStartTomorrow = examRepository.findByExamDateFrom(c.get(Calendar.YEAR), c.get(Calendar.MONTH)+1, c.get(Calendar.DAY_OF_MONTH));
        for(Exam exam : examsStartTomorrow) {
            emailService.sendExamStartDateReminder(exam);
        }

        List<Exam> examsEndTomorrow = examRepository.findByExamDateTo(c.get(Calendar.YEAR), c.get(Calendar.MONTH)+1, c.get(Calendar.DAY_OF_MONTH));
        for(Exam exam : examsEndTomorrow) {
            emailService.sendExamEndDateReminder(exam);
        }

    }


}
