import { Controller } from '@hotwired/stimulus'
import Sortable from 'sortablejs'
import * as Rails from '@rails/ujs'

export default class extends Controller {
  animationValue: number
  resourceNameValue: string
  paramNameValue: string
  sortable: Sortable
  handleValue: string
  // @ts-ignore
  element: HTMLElement

  static values = {
    resourceName: String,
    paramName: {
      type: String,
      default: 'position'
    },
    animation: Number,
    handle: String
  }

  initialize () {
    this.end = this.end.bind(this)
  }

  connect () {
    this.sortable = new Sortable(this.element, {
      ...this.defaultOptions,
      ...this.options
    })
  }

  disconnect () {
    this.sortable.destroy()
    this.sortable = undefined
  }

  end ({ item, newIndex }) {
    if (!item.dataset.sortableUpdateUrl || !window._rails_loaded) return

    const param = this.resourceNameValue ? `${this.resourceNameValue}[${this.paramNameValue}]` : this.paramNameValue

    const data = new FormData()
    data.append(param, newIndex + 1)

    Rails.ajax({
      url: item.dataset.sortableUpdateUrl,
      type: 'PATCH',
      data
    })
  }

  get options (): Sortable.Options {
    return {
      animation: this.animationValue || this.defaultOptions.animation || 150,
      handle: this.handleValue || this.defaultOptions.handle || undefined,
      onEnd: this.end
    }
  }

  get defaultOptions (): Sortable.Options {
    return {}
  }
}