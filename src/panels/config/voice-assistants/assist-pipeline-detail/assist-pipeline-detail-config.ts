import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators";
import memoizeOne from "memoize-one";
import { SchemaUnion } from "../../../../components/ha-form/types";
import { AssistPipeline } from "../../../../data/assist_pipeline";
import { HomeAssistant } from "../../../../types";

@customElement("assist-pipeline-detail-config")
export class AssistPipelineDetailConfig extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public data?: Partial<AssistPipeline>;

  @property() public supportedLanguages?: string[];

  public async focus() {
    await this.updateComplete;
    const input = this.renderRoot?.querySelector("ha-form");
    input?.focus();
  }

  private _schema = memoizeOne(
    (supportedLanguages?: string[]) =>
      [
        {
          name: "",
          type: "grid",
          schema: [
            {
              name: "name",
              required: true,
              selector: {
                text: {},
              },
            },
            {
              name: "language",
              required: true,
              selector: {
                language: {
                  languages: supportedLanguages ?? [],
                },
              },
            },
          ] as const,
        },
      ] as const
  );

  private _computeLabel = (
    schema: SchemaUnion<ReturnType<typeof this._schema>>
  ): string =>
    this.hass.localize(
      `ui.panel.config.voice_assistants.assistants.pipeline.detail.form.${schema.name}`
    );

  protected render() {
    return html`
      <div class="section">
        <div class="intro">
          <h3>Configuration</h3>
          <p>Main configuration of your assistant</p>
        </div>
        <ha-form
          .schema=${this._schema(this.supportedLanguages)}
          .data=${this.data}
          .hass=${this.hass}
          .computeLabel=${this._computeLabel}
        ></ha-form>
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      .section {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        box-sizing: border-box;
        padding: 16px;
      }
      .intro {
        margin-bottom: 16px;
      }
      h3 {
        font-weight: normal;
        font-size: 22px;
        line-height: 28px;
        margin-top: 0;
        margin-bottom: 4px;
      }
      p {
        color: var(--secondary-text-color);
        font-size: var(--mdc-typography-body2-font-size, 0.875rem);
        margin-top: 0;
        margin-bottom: 0;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "assist-pipeline-detail-config": AssistPipelineDetailConfig;
  }
}
