"""
Basic input/output terminal interface
"""

class TerminalBase(object):
    """Basic input/output terminal interface"""

    def __init__(self):
        super(TerminalBase, self).__init__()
        
    def execute(self, command):
        pass