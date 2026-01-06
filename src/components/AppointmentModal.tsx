import { useCallback, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Radio,
  Button,
  Flex,
  Switch,
  Alert,
  Popconfirm,
} from 'antd';
import { DeleteOutlined, WifiOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAppointmentStore } from '../store/appointmentStore';
import { CATEGORY_COLORS, type Appointment, type AppointmentCategory } from '../types/appointment';

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
  isAllDay: boolean;
}

export function AppointmentModal({ open, onClose, appointment }: AppointmentModalProps) {
  const [form] = Form.useForm<FormValues>();
  const { addAppointment, updateAppointment, deleteAppointment, selectedDate, isOnline } =
    useAppointmentStore();

  // Watch the isAllDay field to control time picker visibility
  const isAllDay = Form.useWatch('isAllDay', form) ?? false;
  const isEditMode = !!appointment;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      if (appointment) {
        // Edit mode: populate form with existing data
        const allDay = appointment.isAllDay ?? false;
        form.setFieldsValue({
          title: appointment.title,
          date: dayjs(appointment.date),
          time: appointment.time && !allDay ? dayjs(appointment.time, 'HH:mm') : undefined,
          category: appointment.category,
          description: appointment.description,
          isAllDay: allDay,
        });
      } else {
        // Create mode: set defaults
        form.setFieldsValue({
          date: selectedDate ? dayjs(selectedDate) : dayjs(),
          category: 'work',
          isAllDay: false,
        });
      }
    } else {
      form.resetFields();
    }
  }, [open, appointment, selectedDate, form]);

  const handleAllDayChange = useCallback(
    (checked: boolean) => {
      form.setFieldValue('isAllDay', checked);
      if (checked) {
        form.setFieldValue('time', undefined);
      }
    },
    [form]
  );

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();

      const appointmentData = {
        title: values.title,
        date: values.date.format('YYYY-MM-DD'),
        time: values.isAllDay ? undefined : values.time?.format('HH:mm'),
        category: values.category,
        description: values.description,
        isAllDay: values.isAllDay,
      };

      if (isEditMode && appointment) {
        updateAppointment(appointment.id, appointmentData);
      } else {
        addAppointment(appointmentData);
      }

      onClose();
    } catch (error) {
      // Validation failed - fields will be marked as dirty
      console.log('Validation failed:', error);
    }
  }, [form, isEditMode, appointment, addAppointment, updateAppointment, onClose]);

  const handleDelete = useCallback(() => {
    if (appointment) {
      deleteAppointment(appointment.id);
      onClose();
    }
  }, [appointment, deleteAppointment, onClose]);

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
        {/* Offline Notice */}
        {!isOnline && (
          <Alert
            type="info"
            icon={<WifiOutlined />}
            message="You're offline"
            description="Your changes will be saved locally and synced when you're back online."
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

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

          {!isAllDay && (
            <Form.Item name="time" label="Time" style={{ flex: 1 }}>
              <TimePicker format="h:mm A" use12Hours style={{ width: '100%' }} />
            </Form.Item>
          )}
        </Flex>

        <Form.Item name="isAllDay" valuePropName="checked" style={{ marginBottom: 16 }}>
          <Flex align="center" gap={8}>
            <Switch checked={isAllDay} onChange={handleAllDayChange} />
            <span>All Day Event</span>
          </Flex>
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Radio.Group>
            <Radio.Button value="work">
              <Flex align="center" gap={6}>
                <span
                  className="category-color-dot"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: CATEGORY_COLORS.work,
                    display: 'inline-block',
                  }}
                />
                Work
              </Flex>
            </Radio.Button>
            <Radio.Button value="home">
              <Flex align="center" gap={6}>
                <span
                  className="category-color-dot"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: CATEGORY_COLORS.home,
                    display: 'inline-block',
                  }}
                />
                Home
              </Flex>
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="description" label="Notes">
          <TextArea placeholder="Add notes (optional)" rows={3} />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Flex justify={isEditMode ? 'space-between' : 'flex-end'} align="center">
            {isEditMode && (
              <Popconfirm
                title="Delete Appointment"
                description="Are you sure you want to delete this appointment?"
                onConfirm={handleDelete}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
            )}
            <Flex gap={8}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" onClick={handleSubmit}>
                {isEditMode ? 'Save Changes' : 'Create Appointment'}
              </Button>
            </Flex>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
}
