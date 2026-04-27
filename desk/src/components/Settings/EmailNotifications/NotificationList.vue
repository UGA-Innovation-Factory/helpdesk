<template>
  <SettingsLayoutBase
    :title="__('Email Notifications')"
    :description="
      __(
        'Customize your email notification preferences to stay informed about important updates and activities.'
      )
    "
  >
    <template #content>
      <ul class="isolate -ml-3">
        <li
          v-for="notification in notifications"
          :key="notification.name"
          class="flex items-start justify-between p-3 rounded relative"
        >
          <div class="flex flex-col gap-1 pr-8">
            <h2
              class="text-base font-medium text-ink-gray-7 relative z-10 pointer-events-none"
            >
              {{ notification.label }}
            </h2>
            <p
              class="text-sm text-ink-gray-5 truncate relative z-10 pointer-events-none"
            >
              {{ notification.description }}
            </p>
            <div
              v-if="notification.name === 'reply_via_agent'"
              class="relative z-20 mt-2"
              @click.stop
            >
              <Switch
                size="sm"
                :label="__('Use template for email-generated tickets')"
                v-model="allowReplyViaAgentTemplateForEmailTickets"
                :disabled="replyViaAgentSettings.loading || updateReplyViaAgentSettings.loading"
                @update:model-value="onToggleReplyViaAgentTemplateForEmailTickets"
                :style="{ background: 'transparent', padding: '0px' }"
                class="max-w-fit"
              />
            </div>
          </div>
          <FeatherIcon
            name="chevron-right"
            class="text-ink-gray-7 size-4 relative z-10 pointer-events-none mt-1"
          />
          <button
            type="button"
            class="w-full h-full absolute top-0 left-0 hover:bg-gray-50 rounded-[inherit]"
            @click="
              () => {
                props.onSelect(notification);
              }
            "
          >
            <span class="sr-only">{{
              __("customize {0}", notification.name)
            }}</span>
          </button>
        </li>
      </ul>
    </template>
  </SettingsLayoutBase>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { __ } from "@/translation";
import type { AtLeastOneNotifcation, Notification } from "./types";
import { createResource, Switch } from "frappe-ui";
import SettingsLayoutBase from "@/components/layouts/SettingsLayoutBase.vue";

const props = defineProps<{
  onSelect: (notification: Notification) => void;
}>();

const allowReplyViaAgentTemplateForEmailTickets = ref(false);
const replyViaAgentContent = ref("");
const replyViaAgentEnabled = ref(false);

const replyViaAgentSettings = createResource({
  url: "helpdesk.api.settings.email_notifications.get_data",
  method: "GET",
  params: {
    notification: "reply_via_agent",
  },
  auto: true,
  onSuccess(data: {
    enabled: boolean;
    content: string;
    allow_reply_via_agent_template_for_email_tickets: boolean;
  }) {
    replyViaAgentEnabled.value = data.enabled;
    replyViaAgentContent.value = data.content;
    allowReplyViaAgentTemplateForEmailTickets.value =
      data.allow_reply_via_agent_template_for_email_tickets;
  },
});

const updateReplyViaAgentSettings = createResource({
  url: "helpdesk.api.settings.email_notifications.update_reply_via_agent",
  method: "PUT",
  auto: false,
  onSuccess(data: {
    enabled: boolean;
    content: string;
    allow_reply_via_agent_template_for_email_tickets: boolean;
  }) {
    replyViaAgentEnabled.value = data.enabled;
    replyViaAgentContent.value = data.content;
    allowReplyViaAgentTemplateForEmailTickets.value =
      data.allow_reply_via_agent_template_for_email_tickets;
  },
});

function onToggleReplyViaAgentTemplateForEmailTickets(value: boolean) {
  updateReplyViaAgentSettings.submit({
    enabled: replyViaAgentEnabled.value,
    content: replyViaAgentContent.value,
    allow_reply_via_agent_template_for_email_tickets: value,
  });
}

const notifications: AtLeastOneNotifcation = [
  {
    name: "share_feedback",
    label: __("Share feedback"),
    description: __(
      "Sent to the user who has raised the ticket after the ticket is closed or resolved"
    ),
  },
  {
    name: "acknowledgement",
    label: __("Acknowledgement"),
    description: __("Sent to the user right after creating an email ticket"),
  },
  {
    name: "reply_to_agents",
    label: __("Reply from contact"),
    description: __(
      "Sent to all of the assigned agents after a reply from one of the contacts"
    ),
  },
  {
    name: "reply_via_agent",
    label: __("Reply from agent"),
    description: __(
      "Sent to all of the recipients associated with an agent's reply"
    ),
  },
];
</script>
