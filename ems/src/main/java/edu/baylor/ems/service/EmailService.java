package edu.baylor.ems.service;

import edu.baylor.ems.model.Exam;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

@Service
public class EmailService {
    public static final String EXAM_START_DATE_REMINDER_TEMPLATE = "<p>This is a reminder that you can take '%s' exam starting from tomorrow, %s.</p>";
    public static final String EXAM_END_DATE_REMINDER_TEMPLATE = "<p>This is a reminder that tomorrow, %s, is the last day you can take '%s' exam.</p>";
    public static final String EXAM_ASSIGNED_NOTIFICATION_TEMPLATE = "<p>You have been assigned to '%s' exam, that is available from %s to %s.</p>";
    public static final String SEND_EMAIL_FROM = "noreply@tcs.ecs.baylor.edu";
    private static final Logger logger = LogManager.getLogger(EmailService.class.getName());
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendExamStartDateReminder(Exam exam) {
        logger.info("Serevice called for sending exam start date reminder");
        String subject = "Texas Teacher Training exam start date reminder";
        DateFormat dateFormat = new SimpleDateFormat("MMMM d, yyyy");
        logger.info("Creating email");
        String emailContent = String.format(EXAM_START_DATE_REMINDER_TEMPLATE, exam.getConfigurationName(), dateFormat.format(exam.getExamDateFrom()));
        try {
            logger.info("sending email");
            sendEmail(subject, exam.getExaminee(), emailContent);
        } catch (MessagingException e) {
            // change later to custom exception
            e.printStackTrace();
        }
    }

    public void sendExamEndDateReminder(Exam exam) {
        logger.info("Service called for exam end date reminder");
        String subject = "Texas Teacher Training exam end date reminder";
        DateFormat dateFormat = new SimpleDateFormat("MMMM d, yyyy");
        logger.info("Creating email");
        String emailContent = String.format(EXAM_END_DATE_REMINDER_TEMPLATE, dateFormat.format(exam.getExamDateTo()), exam.getConfigurationName());
        try {
            logger.info("sending email");
            sendEmail(subject, exam.getExaminee(), emailContent);
        } catch (MessagingException e) {
            // change later to custom exception
            e.printStackTrace();
        }
    }

    public void sendExamAssignmentNotification(Exam exam) {
        logger.info("Service called for sending exam assignment notification");
        String subject = "Texas Teacher Training exam assignment";
        DateFormat dateFormat = new SimpleDateFormat("MMMM d, yyyy");
        logger.info("Email created");
        String emailContent = String.format(EXAM_ASSIGNED_NOTIFICATION_TEMPLATE, exam.getConfigurationName(), dateFormat.format(exam.getExamDateFrom()), dateFormat.format(exam.getExamDateTo()));
        try {
            sendEmail(subject, exam.getExaminee(), emailContent);
            logger.info("Sending email");
        } catch (MessagingException e) {
            // change later to custom exception
            e.printStackTrace();
        }
    }

    private void sendEmail(String subject, String sendTo, String emailContent) throws MessagingException {
        logger.info("Service called for sending email");

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");

        helper.setText(emailContent, true);
        helper.setFrom(SEND_EMAIL_FROM);
        helper.setTo(sendTo);
        helper.setSubject(subject);
        logger.info("Configuration set up for sending eamil");
        logger.info("Sending email");

        javaMailSender.send(message);

    }


}
