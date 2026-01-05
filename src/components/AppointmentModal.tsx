import { useCallback, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, Radio, Button, Flex } from 'antd';
import dayjs from 'dayjs';
import { useAppointmentStore } from '../store/appointmentStore';
import type { Appointment, AppointmentCategory } from '../types/appointment';

const { TextArea } = Input;

interface AppointmentModalProps {
  open: boolean;
  onClose: () => void;
  appointment?: Appointment; // For edit mode
}

interface FormValues {
  title: string;
  date: dayjs.Dayjs;
  time?: dayjs.Dayjs;
  category: AppointmentCategory;
  description?: string;
}

export function AppointmentModal({ open, onClose, appointment }: AppointmentModalProps) {
  const [form] = Form.useForm<FormValues>();
  const { addAppointment, updateAppointment, selectedDate } = useAppointmentStore();

  const isEditMode = !!appointment;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      if (appointment) {
        // Edit mode: populate form with existing data
        form.setFieldsValue({
          title: appointment.title,
          date: dayjs(appointment.date),
          time: appointment.time ? dayjs(appointment.time, 'HH:mm') : undefined,
          category: appointment.category,
          description: appointment.description,
        });
      } else {
        // Create mode: set defaults
        form.setFieldsValue({
          date: selectedDate ? dayjs(selectedDate) : dayjs(),
          category: 'work',
        });
      }
    } else {
      form.resetFields();
    }
  }, [open, appointment, selectedDate, form]);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();

      const appointmentData = {
        title: values.title,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time?.format('HH:mm'),
        category: values.category,
        description: values.description,
      };

      if (isEditMode && appointment) {
        updateAppointment(appointment.id, appointmentData);
      } else {
        addAppointment(appointmentData);
      }

      onClose();
    } catch (error) {
      // Validation failed
      console.log('Validation failed:', error);
    }
  }, [form, isEditMode, appointment, addAppointment, updateAppointment, onClose]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onClose();
  }, [form, onClose]);

  return (
    <Modal
      title={isEditMode ? 'Edit Appointment' : 'New Appointment'}
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnHidden
      width={480}
    >
      <Form form={form} layout="vertical" requiredMark="optional" style={{ marginTop: 16 }}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="Enter appointment title" />
        </Form.Item>

        <Flex gap={16}>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select a date' }]}
            style={{ flex: 1 }}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="time" label="Time" style={{ flex: 1 }}>
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Flex>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Radio.Group>
            <Radio.Button value="work">Work</Radio.Button>
            <Radio.Button value="home">Home</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea placeholder="Add a description (optional)" rows={3} />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Flex justify="flex-end" gap={8}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>
              {isEditMode ? 'Save Changes' : 'Create Appointment'}
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
}
