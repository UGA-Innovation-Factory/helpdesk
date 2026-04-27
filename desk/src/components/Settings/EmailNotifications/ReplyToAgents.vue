<template>
  <Notification
    v-model:content="content"
    :defaultContent="defaultContent"
    v-model:enabled="enabled"
    documentationLink="https://docs.frappe.io/helpdesk/email-notifications#available-variables-reply-from-contact"
    ref="compRef"
    name="reply_to_agents"
    :title="props.notification.label"
    :description="props.notification.description"
    :submitting="updateSettings.loading"
    :onBack="props.onBack"
    :onSubmit="onSubmit"
    :onGetDataSuccess="onGetDataSuccess"
  >
    <template #formFields>
      <Switch
        size="sm"
        :label="__('Use template for email-generated tickets')"
        v-model="allowReplyToAgentTemplateForEmailTickets"
        @update:model-value="compRef?.setUnsavedChanges()"
        :style="{ background: 'transparent', padding: '0px' }"
        class="max-w-fit"
      />
    </template>
  </Notification>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Notification from "./Notification.vue";
import { __ } from "@/translation";
import { createResource, Switch } from "frappe-ui";
import type {
  Notification as NotificationType,
  ReplyToAgentsSettings,
} from "./types";

const props = defineProps<{
  onBack: () => void;
  notification: NotificationType;
}>();

const content = ref("");
const defaultContent = ref("");
const enabled = ref(false);
const allowReplyToAgentTemplateForEmailTickets = ref(false);
const compRef = ref<InstanceType<typeof Notification>>();

const updateSettings = createResource({
  url: "helpdesk.api.settings.email_notifications.update_reply_to_agents",
  method: "PUT",
  auto: false,
  onSuccess(data: ReplyToAgentsSettings) {
    enabled.value = data.enabled;
    content.value = data.content;
    allowReplyToAgentTemplateForEmailTickets.value =
      data.allow_reply_to_agent_template_for_email_tickets;
    compRef.value?.resetUnsavedChanges();
  },
});

function onSubmit() {
  return updateSettings.submit({
    enabled: enabled.value,
    content: content.value,
    allow_reply_to_agent_template_for_email_tickets:
      allowReplyToAgentTemplateForEmailTickets.value,
  });
}

function onGetDataSuccess(
  data: ReplyToAgentsSettings & { default_content: string }
) {
  enabled.value = data.enabled;
  content.value = data.content;
  allowReplyToAgentTemplateForEmailTickets.value =
    data.allow_reply_to_agent_template_for_email_tickets;
  defaultContent.value = data.default_content;
}
</script>
