module Card::Sizeable
  extend ActiveSupport::Concern

  SIZES = %w[xs s m l xl].freeze

  included do
    validates :size, inclusion: { in: SIZES }, allow_blank: true

    scope :sized, -> { where.not(size: [nil, ""]) }
    scope :unsized, -> { where(size: [nil, ""]) }
    scope :by_size, ->(size) { where(size: size.to_s.downcase) }
  end

  def sized?
    size.present?
  end

  def size_class
    sized? ? "card--size-#{size}" : "card--size-xs"
  end

  def display_size
    sized? ? size.upcase : "Unsized"
  end

  def set_size(new_size)
    update!(size: new_size)
  end

  def unset_size
    update!(size: nil)
  end
end
