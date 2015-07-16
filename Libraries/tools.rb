
class String
    def to_b
        (self.downcase == 'true' || self.downcase == '1')
    end
end