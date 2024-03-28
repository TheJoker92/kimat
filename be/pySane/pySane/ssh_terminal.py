"""
Terminal that interacts with the system shell.
"""

#Imports
#TODO twisted
from .terminal_base import TerminalBase

class StdTerminal(TerminalBase):
    """Terminal that interacts with the system shell."""

    def __init__(self):
        super(StdTerminal, self).__init__()

        self._connected = False

    def connect(self, address, username, password):


    def execute(self, command):
        if not self._connected:
            return None
        
        #TODO